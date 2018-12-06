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
          height="600px"
          :data="chartData"
          :messages="{empty: 'No data'}"
          xtitle="Total Employment"
          ytitle="County Name"
          thousands=","
          download="youth_employment_by_county">
        </bar-chart>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import Dexie from 'dexie'
import { eventBus } from '@/main'

export default {
  data () {
    return {
      chartData: [],
      db: new Dexie('counties'),
      noData: null,
      stateCode: null
    }
  },

  async created () {
    const res = await axios.get('https://census-qwi.herokuapp.com/county-fips')
    this.db.version(1).stores({
      counties: 'id, name'
    })
    let countyData = []
    for (let i = 0; i < res.data.counties.length; i++) {
      countyData.push({ id: res.data.counties[i].Code, name: res.data.counties[i].Name })
    }
    const dexie = await this.db.counties(Dexie.bulkPut(countyData))
    console.log(dexie)
    eventBus.$on('chartData', (data) => {
      this.chartData.length = 0
      this.noData = false
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] > 0) this.chartData.push([data[i][10], data[i][0]])
      }
    })
    eventBus.$on('noContent', () => {
      this.noData = true
    })
  }
}
</script>

<style lang="css">
</style>
