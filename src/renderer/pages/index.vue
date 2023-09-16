<template>
  <v-app :style="'background: transparent; zoom: ' + config.settings['general.scale'] / 100 + ';'">
    <schedule class="bg-t" :config="config" />
    <v-main id="click-through">
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
    const el = document.getElementById('click-through')
    el.addEventListener('mouseenter', () => {
      if (this.config.settings['general.windowClickThrough']) {
        ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
      } else {
        ipcRenderer.send('set-ignore-mouse-events', false)
      }
    })
    el.addEventListener('mouseleave', () => {
      ipcRenderer.send('set-ignore-mouse-events', false)
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
