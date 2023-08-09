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
        编译于 {{ metadata.compileTime }}<br>
        <a href="https://github.com/TimFang4162/desktop-schedule/">https://github.com/TimFang4162/desktop-schedule/</a><br>

        简洁而不失优雅的桌面课程表<br><br>
        {{ hitokoto }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          text
          @click="closeDialog()"
        >
          关闭
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
    metadata: {},
    hitokoto: ''
  }),
  async mounted () {
    this.metadata = await ipcRenderer.invoke('getMetadata')
    this.fetchHitokoto()
  },
  methods: {
    fetchHitokoto () {
      fetch('https://v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
          this.hitokoto = data.hitokoto
        })
        .catch(console.error)
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
