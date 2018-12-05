<template lang="html">
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
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
import { eventBus } from '@/main'

export default {
  data () {
    return {
      chartData: []
    }
  },

  created () {
    eventBus.$on('chartData', (data) => {
      this.chartData.length = 0
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] > 500) this.chartData.push([data[i][10], data[i][0]])
      }
    })
  },

  methods: {

  }
}
</script>

<style lang="css">
</style>
