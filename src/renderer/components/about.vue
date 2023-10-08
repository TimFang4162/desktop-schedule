<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-dialog :value="aboutDialog" persistent max-width="35%">
    <v-card>
      <v-card-title class="text-h5">
        关于
      </v-card-title>
      <v-card-text>
        Desktop Schedule {{ metadata.appVersion }}{{ updateAvaliable === 'false' ? " 最新" : "" }}<br>
        编译于 {{ metadata.compileTime }}<br>
        <a
          @click="openExternal('https://github.com/TimFang4162/desktop-schedule/')"
        >https://github.com/TimFang4162/desktop-schedule/</a><br>

        简洁而不失优雅的桌面课程表<br><br>
        <v-btn
          :loading="updateAvaliable === 'pending'"
          :disabled="updateAvaliable === 'pending'"
          icon @click="fetchUpdate()"
        >
          <v-icon>
            mdi-reload
          </v-icon>
        </v-btn>
        <template v-if="updateAvaliable === 'pending'">
          正在检查更新
        </template>
        <template v-if="updateAvaliable === 'true'">
          更新可用: {{ updateJson.tag_name }}
          <template v-if="updateJson.body !== ''">
            <br>
            {{ updateJson.body }}<br>
          </template>
          <a @click="openExternal(updateJson.html_url)">前往下载</a>
        </template>
        <template v-if="updateAvaliable === 'false'">
          当前为最新版本
        </template>
        <template v-if="updateAvaliable === 'failed'">
          无法检查更新。请确保与 github.com 连接通畅
        </template>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="closeDialog()">
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
    updateJson: {},
    updateAvaliable: 'unknown'
  }),
  async mounted () {
    this.metadata = await ipcRenderer.invoke('getMetadata')
    this.fetchUpdate()
  },
  methods: {
    openExternal (url) {
      ipcRenderer.send('openExternal', url)
    },
    compareVersion (preVersion = '', lastVersion = '') {
      if (preVersion[0] === 'v') {
        preVersion = preVersion.substring(1)
      }
      if (lastVersion[0] === 'v') {
        lastVersion = lastVersion.substring(1)
      }
      const sources = preVersion.split('.')
      const dests = lastVersion.split('.')
      const maxL = Math.max(sources.length, dests.length)
      let result = 0
      for (let i = 0; i < maxL; i++) {
        const preValue = sources.length > i ? sources[i] : 0
        const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
        const lastValue = dests.length > i ? dests[i] : 0
        const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
        if (preNum < lastNum) {
          result = -1
          break
        } else if (preNum > lastNum) {
          result = 1
          break
        }
      }
      return result
    },
    fetchUpdate () {
      this.updateAvaliable = 'pending'
      fetch('https://api.github.com/repos/TimFang4162/desktop-schedule/releases/latest', {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
        .then(response => response.json())
        .then(data => {
          this.updateJson = data
          if (data.draft === false) {
            if (this.compareVersion(this.metadata.appVersion, data.tag_name) === -1) {
              this.updateAvaliable = 'true'
            } else if (this.compareVersion(this.metadata.appVersion, data.tag_name) === 0) {
              this.updateAvaliable = 'false'
            }
          }
        })
        .catch(error => {
          this.updateAvaliable = 'failed'
          console.error(error)
        })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
