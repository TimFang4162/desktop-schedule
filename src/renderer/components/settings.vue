<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-dialog
    v-if="reload"
    :value="settingsDialog"
    persistent
    max-width="35%"
  >
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
              <tr
                v-for="(course, index) in tempConfig.courses"
                :key="index"
              >
                <td>{{ index }}</td>
                <td>{{ course.name }}</td>
                <td>{{ course.action }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <template v-else>
          <v-row align="center">
            <v-col cols="6">
              <v-subheader>
                编辑配置
              </v-subheader>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="editCourseId"
                :items="Object.entries(tempConfig.courses)"
                item-text="[1].name"
                item-value="[0]"
                label="Select"
                single-line
              />
            </v-col>
          </v-row>
          <v-btn text @click="addCourse()">
            <v-icon>
              mdi-plus
            </v-icon>
            添加课程配置
          </v-btn>
          <v-btn
            color="red"
            text
            @click="deleteCourse(editCourseId)"
          >
            <v-icon>
              mdi-trash-can-outline
            </v-icon>
            删除 {{ tempConfig.courses[editCourseId].name }}
          </v-btn>
          <v-row align="center">
            <v-col cols="6">
              <v-subheader>
                课程名称
              </v-subheader>
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="tempConfig.courses[editCourseId].name" />
            </v-col>
            <v-col cols="6">
              <v-subheader>
                点击事件
              </v-subheader>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="tempConfig.courses[editCourseId].action"
                :items="['doNothing', 'openFtp', 'runCommand']"
              />
            </v-col>
            <template v-if="tempConfig.courses[editCourseId].action === 'openFtp'">
              <v-col cols="6">
                <v-subheader>
                  FTP 服务器 IP
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_ip" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP 账号
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_user" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP 密码
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_pwd" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP 路径
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_folder" />
              </v-col>
            </template>
            <template v-if="tempConfig.courses[editCourseId].action === 'runCommand'">
              <v-col cols="6">
                <v-subheader>
                  命令行
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$command" />
              </v-col>
            </template>
          </v-row>
        </template>
      </v-card-text>
      <v-card-title class="text-h6">
        通用
      </v-card-title>
      <v-card-text>
        <v-switch v-model="tempConfig.config.startWithSystem" label="随系统自启动" />

        <v-switch v-model="tempConfig.config.windowClickThrough" label="主窗口空白区域点击穿透" />

        <v-slider
          v-model="tempConfig.config.scale"
          step="0.05"
          :max="2.0"
          :min="0.1"
          label="界面缩放"
          class="align-center"
        >
          <template #append>
            <v-text-field
              v-model="tempConfig.config.scale"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>
        <v-slider
          v-model="tempConfig.config.navigationDrawerWidth"
          step="5"
          :max="500"
          :min="100"
          label="侧栏宽度"
          class="align-center"
        >
          <template #append>
            <v-text-field
              v-model="tempConfig.config.navigationDrawerWidth"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>
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
            <v-radio-group
              v-model="tempConfig.config.theme"
              row
            >
              <v-radio
                label="浅色"
                value="light"
              />
              <v-radio
                label="深色"
                value="dark"
              />
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
        <v-spacer />

        <v-btn
          text
          @click="closeDialog()"
        >
          取消
        </v-btn>

        <v-btn
          text
          @click="saveConfig()"
        >
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
    reload: true // use for programmic reload vue elements
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
    },
    coursesOnEdit () {
      this.editCourseId = Object.entries(this.tempConfig.courses)[0][0]
      this.editCourses = true
    },
    addCourse () {
      const length = Object.entries(this.tempConfig.courses).length
      this.$set(this.tempConfig.courses, String(length), {
        name: '',
        action: 'doNothing',
        config: {
        }
      })
      this.editCourseId = String(length)
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
      await ipcRenderer.send('setStartWithSystem', this.tempConfig.config.startWithSystem)
      await this._saveTempConfig()
      this.closeDialog()
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
