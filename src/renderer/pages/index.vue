<template>
  <v-app :style="'background: transparent; zoom: ' + config.settings['general.scale'] / 100 + ';'">
    <schedule class="bg-t" :config="config" />
    <v-main>
      <!-- <v-container>
      </v-container> -->
    </v-main>
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
    const el = document.getElementsByClassName('v-main__wrap')[0]
    window.addEventListener('mousemove', event => {
      if (event.target === el) {
        ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
      } else {
        ipcRenderer.send('set-ignore-mouse-events', false)
      }
    })
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

.theme--dark.v-toolbar.v-sheet {
  background: transparent;
}

::-webkit-scrollbar {
  width: 0 !important
}
</style>
