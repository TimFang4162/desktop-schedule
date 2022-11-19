<template>
  <v-app class="bg-t">
    <schedule class="bg-t" :config="config" />
  </v-app>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'IndexPage',
  components: {},
  async asyncData () {
    const config = await ipcRenderer.invoke('readConfig')
    // console.log(config)
    return { config }
  },
  data: () => ({
  }),
  mounted () {
    this.$vuetify.theme.dark = true
  },
  methods: {}
}
</script>

<style>
.bg-t {
  background: #0003 !important;
}
html {
  background: transparent;
}
</style>
