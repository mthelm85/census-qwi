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
          :label="item.label"
          @change="emitToHome(item.label, item.value)">
        </v-select>

      </v-list-tile>
    </v-list>
    <v-btn color="primary" @click="fetchData">Fetch Data</v-btn>
    <v-dialog
      v-model="dialog"
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
import states from '@/assets/states'

export default {
  data () {
    return {
      dialog: false,
      items: [
        { label: 'State', icon: 'near_me', list: states.states, value: null },
        { label: 'Year/Quarter', icon: 'event', list: ['2017/Q1', '2017/Q2', '2017/Q3', '2017/Q4'], value: null }
      ],
      stateFipsObject: states.stateFIPS
    }
  },

  computed: {
    stateFips () {
      return this.stateFipsObject[this.items[0].value]
    }
  },

  methods: {
    emitToHome (event, value) {
      if (event === 'State') eventBus.$emit(event, value)
    },
    async fetchData () {
      this.dialog = true
      const res = await axios.get('https://api.census.gov/data/timeseries/qwi/sa', {
        params: {
          get: 'Emp',
          for: 'county:*',
          in: `state:${this.stateFipsObject[this.items[0].value]}`,
          year: '2017',
          quarter: '4',
          sex: '0',
          agegrp: 'A01',
          ownercode: 'A05',
          firmsize: '0',
          seasonadj: 'U',
          industry: '00',
          key: 'f0c0e4dc0941d95473e9ce88d697d682b1d7fca4'
        }
      })
      eventBus.$emit('chartData', res.data)
      this.dialog = false
    }
  }
}
</script>

<style lang="css">
</style>
