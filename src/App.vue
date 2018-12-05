<template>
  <v-app>
    <NavDrawer/>
    <v-content>
      <Home/>
    </v-content>
  </v-app>
</template>

<script>
import Home from '@/components/Home'
import NavDrawer from '@/components/NavDrawer'

export default {
  name: 'App',
  components: {
    Home,
    NavDrawer
  },
  data () {
    return {
      //
    }
  }
}
</script>
