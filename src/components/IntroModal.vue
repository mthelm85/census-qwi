<template lang="html">
  <v-dialog
    v-model="dialog"
    width="500">
    <v-card light>
      <v-card-title
        class="headline grey lighten-2"
        primary-title>
        Explore Employment Stats
      </v-card-title>

      <v-card-text>
        This application allows you to explore employment data by state. Simply select the options
        of your choosing, and then click the 'Get Data' button. The application will pull
        U.S. Census Bureau employment data, based on your settings.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: true
    }
  }
}
</script>

<style lang="css">

</style>
