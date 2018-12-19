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

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
