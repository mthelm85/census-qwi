<template lang="html">
  <v-dialog
    v-model="dialog"
    width="500">
    <v-card light>
      <v-card-title
        class="headline grey lighten-2"
        primary-title>
        Explore Youth Employment (EYE)
      </v-card-title>

      <v-card-text>
        EYE allows you to explore youth employment data in your state. Simply select the options
        of your choosing, and then click the 'Create Chart' button. The application will pull
        U.S. Census Bureau employment data for the 14 - 18 year old age group, based on your settings.
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
