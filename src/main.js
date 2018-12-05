import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

export const eventBus = new Vue()

Vue.config.productionTip = false
Vue.use(VueChartkick, { adapter: Chart })

new Vue({
  render: h => h(App)
}).$mount('#app')
