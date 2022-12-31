<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-dialog
    :value="aboutDialog"
    persistent
    max-width="35%"
  >
    <v-card>
      <v-card-title class="text-h5">
        About
      </v-card-title>
      <v-card-text>
        Desktop Schedule {{ metadata.appVersion }}<br>
        Compiled at {{ metadata.compileTime }}<br>
        <a href="https://github.com/TimFang4162/desktop-schedule/">https://github.com/TimFang4162/desktop-schedule/</a><br>

        A simple desktop tool made with ❤.
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          text
          @click="closeDialog()"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
const { ipcRenderer } = require('electron')

export default {
  props: ['aboutDialog'],
  data: () => ({
    metadata: {}
  }),
  async mounted () {
    this.metadata = await ipcRenderer.invoke('getMetadata')
  },
  methods: {
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
