<template lang="html">
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <div id="map" :height="chartHeight"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { eventBus } from '@/main'
import L from 'leaflet'
const counties = require('@/assets/counties.json')
export default {
  data () {
    return {
      employmentTotals: [],
      stateCode: null
    }
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

  methods: {
    getColor (val, employmentTotals) {
      const max = Math.max(...employmentTotals)
      return val > 0.8 * max ? '#0868ac'
        : val > 0.6 * max ? '#43a2ca'
          : val > 0.4 * max ? '#7bccc4'
            : val > 0.2 * max ? '#bae4bc'
              : '#f0f9e8'
    },
    getTotalEmployment (array, val) {
      return array.find(x => x[10] === val)
    }
  },

  async mounted () {
    const map = L.map('map', { zoomControl: true })
      .locate({ setView: true, maxZoom: 6 })
    map.createPane('labels')
    map.getPane('labels').style.zIndex = 6
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 16,
      minZoom: 4
    }).addTo(map)
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 16,
      minZoom: 4,
      pane: 'labels'
    }).addTo(map)
    eventBus.$on('stateCode', (code) => {
      this.stateCode = code
    })
    // Listen for data from NavDrawer, then generate choropleth
    eventBus.$on('chartData', (data) => {
      // Store just the employment totals into a new array so that we can compute max in getColor (above)
      this.employmentTotals = data.map(element => element[0]).filter(num => num > 0)
      for (let i in counties.features) {
        if (counties.features[i].properties.STATE === `${this.stateCode}` && this.getTotalEmployment(data, counties.features[i].properties.COUNTY) !== undefined) {
          counties.features[i].properties.totalEmployment = this.getTotalEmployment(data, counties.features[i].properties.COUNTY)[0]
        }
      }
      L.geoJSON(counties, {
        style: (feature) => {
          if (feature.properties.totalEmployment && feature.properties.totalEmployment !== null) {
            return {
              'color': this.getColor(feature.properties.totalEmployment, this.employmentTotals),
              'weight': 1,
              'opacity': 1,
              'fillOpacity': 0.5
            }
          } else {
            return {
              'color': '#ffffff',
              'weight': 0.5,
              'opacity': 0,
              'fillOpacity': 0
            }
          }
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties.totalEmployment && feature.properties.totalEmployment !== null) {
            layer.bindPopup(`
                <strong>County:</strong> ${feature.properties.NAME}
                <br />
                <strong>Total Employment:</strong> ${feature.properties.totalEmployment}
              `)
          }
        }
      }).addTo(map)
    })
  }
}
</script>

<style lang="css">
@import "~leaflet/dist/leaflet.css";
#map {
  height: 600px;
}
</style>
