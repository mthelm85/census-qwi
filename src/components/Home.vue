<template lang="html">
  <v-container class="text-xs">
    <v-layout row wrap>
      <v-flex xs12>
        {{ dataDescription }}
        <v-card>
          <v-layout row wrap>
            <v-flex xs6>
              <v-radio-group class="pl-3" :column="false" v-model="visType">
                <v-radio
                  color="primary"
                  v-for="radio in radios"
                  :key="radio.label"
                  :label="radio.label"
                  :value="radio.label">
                </v-radio>
              </v-radio-group>
             </v-flex>
             <v-flex xs6>
               <v-alert
                 dismissible
                 :value="noData"
                 type="warning"
                 transition="scale-transition">
                 No data returned. Try different settings...
               </v-alert>
             </v-flex>
            <v-flex xs12>
              <transition name="fade" mode="out-in">
                <keep-alive>
                  <Map v-if="visType === 'Map'" class="pt-0"></Map>
                  <bar-chart
                    v-else
                    id="barChart"
                    :data="chartData"
                    :messages="{empty: 'No data'}"
                    xtitle="Total Employment"
                    thousands=","
                    download="youth_employment_by_county"
                    :height="chartHeight">
                  </bar-chart>
                </keep-alive>
              </transition>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <IntroModal></IntroModal>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import Dexie from 'dexie'
import { eventBus } from '@/main'
import IntroModal from '@/components/IntroModal'
import Map from '@/components/Map'

export default {
  data () {
    return {
      chartData: [],
      dataDescription: 'No indicator selected',
      db: new Dexie('counties'),
      mapKey: 0,
      noData: null,
      stateCode: null,
      visType: 'Map',
      radios: [{ label: 'Map', value: null }, { label: 'Bar Chart', value: null }]
    }
  },

  components: {
    IntroModal,
    Map
  },

  computed: {
    chartHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '220px'
        case 'sm': return '400px'
        case 'md': return '500px'
        case 'lg': return '600px'
        case 'xl': return '800px'
        default: return '500px'
      }
    }
  },

  async created () {
    try {
      const res = await axios.get('https://cors-anywhere.herokuapp.com/https://census-qwi.herokuapp.com/county-fips')
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
    eventBus.$on('indicatorCode', (code) => {
      code === 'Emp' ? this.dataDescription = 'Total employment for 14 - 18 age group' : this.dataDescription = 'Average monthly earnings'
    })
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
