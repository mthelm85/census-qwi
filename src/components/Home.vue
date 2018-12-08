<template lang="html">
  <v-container grid-list-xs class="text-xs-center">
    <v-layout row wrap>
      <v-flex xs12>
        <v-alert
          :value="noData"
          type="warning"
          transition="scale-transition">
          No data returned. Try different settings...
        </v-alert>
        <bar-chart
          id="barChart"
          :data="chartData"
          :messages="{empty: 'No data'}"
          xtitle="Total Employment"
          thousands=","
          download="youth_employment_by_county"
          :height="chartHeight">
        </bar-chart>
      </v-flex>
    </v-layout>
    <IntroModal></IntroModal>
  </v-container>
</template>

<script>
import axios from 'axios'
import Dexie from 'dexie'
import { eventBus } from '@/main'
import IntroModal from '@/components/IntroModal'

export default {
  data () {
    return {
      chartData: [],
      db: new Dexie('counties'),
      noData: null,
      stateCode: null
    }
  },

  components: {
    IntroModal
  },

  computed: {
    chartHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '220px'
        case 'sm': return '400px'
        case 'md': return '500px'
        case 'lg': return '600px'
        case 'xl': return '800px'
      }
    }
  },

  async created () {
    try {
      const res = await axios.get('https://census-qwi.herokuapp.com/county-fips')
      this.db.version(1).stores({
        counties: 'id, name'
      })
      let countyData = []
      for (let i = 0; i < res.data.counties.length; i++) {
        if ((Math.log(res.data.counties[i].Code) * Math.LOG10E + 1 | 0) === 4) {
          countyData.push({ id: `0${res.data.counties[i].Code}`, name: res.data.counties[i].Name })
        } else {
          countyData.push({ id: `${res.data.counties[i].Code}`, name: res.data.counties[i].Name })
        }
      }
      await this.db.counties.bulkPut(countyData)
    } catch (err) {
      alert(err)
    }
    eventBus.$on('stateCode', (code) => {
      this.stateCode = code
    })
    eventBus.$on('chartData', async (data) => {
      this.chartData.length = 0
      this.noData = false
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] > 0) {
          let countyName = await this.db.counties.where('id').equals(`${this.stateCode}${data[i][10]}`).toArray()
          this.chartData.push([countyName[0].name, data[i][0]])
        }
      }
    })
    eventBus.$on('noContent', () => {
      this.noData = true
    })
  }
}
</script>

<style scoped lang="css">

</style>
