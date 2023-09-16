<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-dialog v-if="reload" :value="settingsDialog" persistent max-width="35%">
    <v-card>
      <v-card-title class="text-h5">
        设置
      </v-card-title>
      <v-card-title class="text-h6">
        课程配置
        <v-spacer />
        <v-btn text @click="coursesOnEdit()">
          <v-icon>mdi-pencil-outline</v-icon>
          编辑
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table v-if="!editCourses">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  配置名称
                </th>
                <th class="text-left">
                  课程名称
                </th>
                <th class="text-left">
                  点击事件
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in tempConfig.courses" :key="index">
                <td>{{ index }}</td>
                <td>{{ course.name }}</td>
                <td>{{ clickActions[course.action].hint }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <template v-else>
          <v-row align="center">
            <v-col cols="4">
              编辑配置
            </v-col>

            <v-col cols="8">
              <v-select
                v-model="editCourseId" :items="Object.entries(tempConfig.courses)" item-text="[1].name"
                item-value="[0]" label="Select" single-line
              />
            </v-col>
          </v-row>
          <v-btn text @click="addCourse()">
            <v-icon>
              mdi-plus
            </v-icon>
            添加课程配置
          </v-btn>
          <v-btn color="red" text @click="deleteCourse(editCourseId)">
            <v-icon>
              mdi-trash-can-outline
            </v-icon>
            删除 {{ tempConfig.courses[editCourseId].name }}
          </v-btn>
          <v-text-field v-model="tempConfig.courses[editCourseId].name" label="课程名称" />
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs" readonly label="点击事件" append-icon="mdi-menu-down"
                :value="clickActions[tempConfig.courses[editCourseId].action].hint" v-on="on"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="(each, index) in clickActions" :key="index" link
                @click="tempConfig.courses[editCourseId].action = index"
              >
                <v-list-item-title>{{ each.hint }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <template v-if="tempConfig.courses[editCourseId].action === 'openFtp'">
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_ip" label="FTP 服务器 IP" />
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_user" label="FTP 账号" />
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_pwd" label="FTP 密码" />
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_folder" label="FTP 路径" />
            命令行 explorer.exe ftp://{{ tempConfig.courses[editCourseId].config.$ftp_user }}:{{
              tempConfig.courses[editCourseId].config.$ftp_pwd }}@{{ tempConfig.courses[editCourseId].config.$ftp_ip }}/{{
              tempConfig.courses[editCourseId].config.$ftp_folder }}
          </template>
          <template v-if="tempConfig.courses[editCourseId].action === 'runCommand'">
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$command" label="命令行" />
          </template>
          <template v-if="tempConfig.courses[editCourseId].action === 'openPath'">
            <v-text-field v-model="tempConfig.courses[editCourseId].config.$path" label="文件夹路径">
              <template #append-outer>
                <v-btn text @click="selectFolder()">选择</v-btn>
              </template>
            </v-text-field>
          </template>
        </template>
      </v-card-text>
      <v-card-title class="text-h6">
        通用
      </v-card-title>
      <v-card-text>
        <v-switch v-model="tempConfig.settings['general.startWithSystem']" label="随系统自启动" />

        <v-switch v-model="tempConfig.settings['general.windowClickThrough']" label="主窗口空白区域点击穿透" />

        <v-slider
          v-model="tempConfig.settings['general.scale']" step="5" :max="200" :min="10" label="界面缩放(%)"
          class="align-center"
        >
          <template #append>
            <v-text-field
              v-model="tempConfig.settings['general.scale']" class="mt-0 pt-0" type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>
        <v-slider
          v-model="tempConfig.settings['general.navigationDrawerWidth']" step="1" :max="100" :min="10"
          label="侧栏宽度(%)" class="align-center"
        >
          <template #append>
            <v-text-field
              v-model="tempConfig.settings['general.navigationDrawerWidth']" class="mt-0 pt-0" type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>

        <v-switch v-model="tempConfig.settings['general.navigationDrawerPositionR']" label="侧栏右置" />
      </v-card-text>
      <v-card-title class="text-h6">
        偏好
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <v-subheader>
              主题(Coming soon)
            </v-subheader>
          </v-col>

          <v-col cols="6">
            <v-radio-group v-model="tempConfig.settings['preference.theme']" row>
              <v-radio label="浅色" value="light" />
              <v-radio label="深色" value="dark" />
            </v-radio-group>
          </v-col>
          <!-- <v-col cols="6">
            <v-subheader>
              Background opacity
            </v-subheader>
          </v-col>
          <v-col cols="6">
            <v-slider
              max="100"
              min="0"
              thumb-label
              step="5"
            />
          </v-col> -->
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              高级
            </v-btn>
          </template>
          <v-list>
            <v-list-item link @click="openDevTools()">
              <v-list-item-title>启动开发者工具</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="openConfigFolder()">
              <v-list-item-title>打开配置文件夹</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer />

        <v-btn text @click="closeDialog()">
          取消
        </v-btn>

        <v-btn text @click="saveConfig()">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
const { ipcRenderer } = require('electron')

export default {
  props: ['settingsDialog', 'config'],
  data: () => ({
    editCourses: false,
    editCourseId: null,
    tempConfig: {},
    reload: true, // use for programmic reload vue elements
    clickActions: {
      openFtp: { hint: '打开FTP地址(Windows)' },
      runCommand: { hint: '运行命令' },
      openPath: { hint: '打开文件夹' },
      doNothing: { hint: '无操作' }
    }
  }),
  beforeMount () {
    this._generateTempConfig()
    console.log('mnt')
  },
  methods: {
    _reload () {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    _deepcopy (object) {
      return JSON.parse(JSON.stringify(object))
    },
    _generateTempConfig () {
      this.tempConfig = this._deepcopy(this.config)
    },
    async _saveTempConfig () {
      await ipcRenderer.send('saveConfig', this.tempConfig)
      await this.$nuxt.refresh()
      // window.location.reload()
    },
    coursesOnEdit () {
      this.editCourseId = Object.entries(this.tempConfig.courses)[0][0]
      this.editCourses = true
    },
    addCourse () {
      let maxId = -1
      for (const each in this.tempConfig.courses) {
        if (each > maxId) {
          maxId = each
        }
      }
      this.$set(this.tempConfig.courses, String(maxId + 1), {
        name: '新建课程',
        action: 'doNothing',
        config: {
        }
      })
      this.editCourseId = String(maxId + 1)
    },
    async deleteCourse (courseId) {
      let unused = true
      for (const eachDay in this.tempConfig.schedule) {
        for (const eachCourse in this.tempConfig.schedule[eachDay]) {
          if (this.tempConfig.schedule[eachDay][eachCourse].ref === courseId) {
            unused = false
          }
        }
      }
      //   console.log(unused)
      if (unused === true) {
        this.$delete(this.tempConfig.courses, courseId)
        this.coursesOnEdit()
      } else {
        await this.$dialog.error({
          text: 'This course is being used in the schedule. Please delete all the courses in the schedule before deleting it',
          title: 'Error'
        })
        this._reload()
      }
    },
    async saveConfig () {
      await ipcRenderer.send('setStartWithSystem', this.tempConfig.settings['general.startWithSystem'])
      await this._saveTempConfig()
      this.closeDialog()
    },
    closeDialog () {
      this.$emit('close')
    },
    async openDevTools () {
      await ipcRenderer.send('openDevTools')
    },
    async openConfigFolder () {
      await ipcRenderer.send('openConfigFolder')
    },
    async selectFolder () {
      const result = await ipcRenderer.invoke('selectFolder')
      if (result !== undefined) {
        this.$set(this.tempConfig.courses[this.editCourseId].config, '$path', result[0])
        // this.tempConfig.courses[this.editCourseId].config.$path = result[0]
      }
    }
  }
}
</script>
