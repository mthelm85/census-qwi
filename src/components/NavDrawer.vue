<template lang="html">
  <v-navigation-drawer permanent app class="text-xs-center">
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title text-xs-center">
            Explore Youth Employment
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-tile
        class="py-2"
        v-for="item in items"
        :key="item.title"
        @click="">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-select
          v-model="item.value"
          :items="item.list"
          :label="item.label">
        </v-select>

      </v-list-tile>
    </v-list>
    <v-btn color="primary" @click="fetchData">Create Chart</v-btn>
    <v-dialog
      v-model="loading"
      persistent
      width="300">
      <v-card
        color="primary"
        dark>
        <v-card-text>
          Retrieving data from the Census Bureau...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import axios from 'axios'
import { eventBus } from '@/main'
import { firmSizeCodes, industryCodes, states, stateFIPS } from '@/assets/dataStore.js'

export default {
  data () {
    return {
      loading: false,
      items: [
        { label: 'State', icon: 'location_on', list: states, value: null },
        { label: 'Year', icon: 'calendar_today', list: ['2017', '2016'], value: null },
        { label: 'Quarter', icon: 'event', list: ['1', '2', '3', '4'], value: null },
        { label: 'Firm Size (# Employees)', icon: 'supervisor_account', list: ['All Firm Sizes', '0 - 19', '20 - 49', '50 - 249', '250 - 499', '500+'], value: null },
        {
          label: 'Industry',
          icon: 'business',
          list: [
            'All Industries',
            'Agriculture, Forestry, Fishing and Hunting',
            'Mining, Quarrying, and Oil and Gas Extraction',
            'Utilities',
            'Construction',
            'Manufacturing',
            'Wholesale Trade',
            'Retail Trade',
            'Transportation and Warehousing',
            'Information',
            'Finance and Insurance',
            'Real Estate and Rental and Leasing',
            'Professional, Scientific, and Technical Services',
            'Management of Companies and Enterprises',
            'Administrative and Support and Waste Management and Remediation Services',
            'Educational Services',
            'Health Care and Social Assistance',
            'Arts, Entertainment, and Recreation',
            'Accommodation and Food Services',
            'Other Services'
          ]
        }
      ]
    }
  },

  computed: {
    firmSize () {
      return firmSizeCodes[this.items[3].value]
    },
    industry () {
      return industryCodes[this.items[4].value]
    },
    stateFips () {
      return stateFIPS[this.items[0].value]
    }
  },

  methods: {
    async fetchData () {
      this.loading = true
      const res = await axios.get('https://api.census.gov/data/timeseries/qwi/sa', {
        params: {
          get: 'Emp',
          for: 'county:*',
          in: `state:${this.stateFips}`,
          year: this.items[1].value,
          quarter: this.items[2].value,
          sex: '0',
          agegrp: 'A01',
          ownercode: 'A05',
          firmsize: this.firmSize,
          seasonadj: 'U',
          industry: this.industry,
          key: 'f0c0e4dc0941d95473e9ce88d697d682b1d7fca4'
        }
      })
      if (res.data.length === 0) {
        eventBus.$emit('noContent')
      } else {
        eventBus.$emit('chartData', res.data)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="css">
</style>
