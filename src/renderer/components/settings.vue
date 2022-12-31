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
        Settings
      </v-card-title>
      <v-card-title class="text-h6">
        Courses
        <v-spacer />
        <v-btn text @click="coursesOnEdit()">
          <v-icon>mdi-pencil-outline</v-icon>
          Edit
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table v-if="!editCourses">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  Ref name
                </th>
                <th class="text-left">
                  Course name
                </th>
                <th class="text-left">
                  Click action
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
                Edit course
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
            Add course
          </v-btn>
          <v-btn
            color="red"
            text
            @click="deleteCourse(editCourseId)"
          >
            <v-icon>
              mdi-trash-can-outline
            </v-icon>
            Delete {{ tempConfig.courses[editCourseId].name }}
          </v-btn>
          <v-row align="center">
            <v-col cols="6">
              <v-subheader>
                Name
              </v-subheader>
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="tempConfig.courses[editCourseId].name" />
            </v-col>
            <v-col cols="6">
              <v-subheader>
                Click action
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
                  FTP server IP
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_ip" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP account
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_user" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP password
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_pwd" />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  FTP folder
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="tempConfig.courses[editCourseId].config.$ftp_folder" />
              </v-col>
            </template>
            <template v-if="tempConfig.courses[editCourseId].action === 'runCommand'">
              <v-col cols="6">
                <v-subheader>
                  Command
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
        General
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <v-subheader>
              Start with system
            </v-subheader>
          </v-col>

          <v-col cols="6">
            <v-switch v-model="tempConfig.config.startWithSystem" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title class="text-h6">
        Preferences
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <v-subheader>
              Theme
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
          Cancel
        </v-btn>

        <v-btn
          text
          @click="saveConfig()"
        >
          Save
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
