<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-navigation-drawer permanent app :width="config.config.navigationDrawerWidth/(config.config.scale/config.config.scale)+'%'" :height="100/(config.config.scale/config.config.scale)+'%'" :right="config.config.navigationDrawerPositionR">
    <!-- force update -->
    <v-list-item>
      <v-list-item-content class="pt-1">
        <v-card-title class="text-h6 pa-0">
          课程表
          <v-spacer />

          <v-menu
            v-if="!onEdit"
            transition="slide-y-transition"
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list-item-group>
                <v-list-item @click="onEdit = true">
                  <v-list-item-icon>
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>编辑</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="settingsDialog = true">
                  <v-list-item-icon>
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>设置</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="aboutDialog = true">
                  <v-list-item-icon>
                    <v-icon>mdi-information-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>关于</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="closeApp()">
                  <v-list-item-icon>
                    <v-icon>mdi-window-close</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>退出</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
              <settings
                v-if="settingsDialog"
                :settings-dialog="settingsDialog"
                :config="config" @close="closeSettings()"
              />
              <about
                v-if="aboutDialog"
                :about-dialog="aboutDialog"
                @close="closeAbout()"
              />
            </v-card>
          </v-menu>
          <v-tooltip v-if="onEdit" bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="onEdit = !onEdit"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
            <span>关闭编辑</span>
          </v-tooltip>
        </v-card-title>
        <v-card-title class="pa-0">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                class="pl-1 pr-1"
                v-bind="attrs"
                text
                v-on="on"
                @click="nowDate = new Date()"
              >
                {{ nowDate.toLocaleDateString() }} {{ scheduleOfTheDay }}
              </v-btn>
            </template>
            <span>切换至当前</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="nowDate.setDate(nowDate.getDate() - 1); nowDate = new Date(nowDate)"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <span>前一天</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="nowDate.setDate(nowDate.getDate() + 1); nowDate = new Date(nowDate)"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
            <span>后一天</span>
          </v-tooltip>
        </v-card-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list nav>
      <v-dialog
        v-if="editDialog"
        v-model="editDialog"
        persistent
        max-width="35%"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">编辑第 {{ onEditId + 1 }} 节课</span>
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="6">
                <v-subheader>
                  课程配置
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="tempConfig.schedule[scheduleOfTheDay][onEditId].ref"
                  :items="Object.entries(config.courses)"
                  item-text="[1].name"
                  item-value="[0]"
                  label="Select"
                  single-line
                />
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  开始时间
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-menu
                  ref="menu"
                  v-model="editStartTimeMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="tempConfig.schedule[scheduleOfTheDay][onEditId].time_start"
                      label="Click to open time picker"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="editStartTimeMenu"
                    v-model="tempConfig.schedule[scheduleOfTheDay][onEditId].time_start"
                    format="24hr"
                  />
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-subheader>
                  结束时间
                </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-menu
                  ref="menu"
                  v-model="editEndTimeMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="tempConfig.schedule[scheduleOfTheDay][onEditId].time_end"
                      label="Click to open time picker"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="editEndTimeMenu"
                    v-model="tempConfig.schedule[scheduleOfTheDay][onEditId].time_end"
                    format="24hr"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="darken-1"
              text
              @click="editDialog = false"
            >
              取消
            </v-btn>
            <v-btn
              color="darken-1"
              text
              @click="courseSaveEdit()"
            >
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <template
        v-for="(each, index) in config.schedule[scheduleOfTheDay]"
      >
        <v-card
          :key="index"
          :class="(isTimeBetween(each.time_start,each.time_end,currentTime) ? 'card-highlight' : 'bg-t')+' '+(index-1!=-1 ? (isTimeBetween(config.schedule[scheduleOfTheDay][index-1].time_end,each.time_start,currentTime) ? 'card-highlight-border' : null): (isTimeBetween('00:00',each.time_start,currentTime) ? 'card-highlight-border' : null))+' '+'mb-2'"
          elevation="0"
          ripple
          @click="courseOnClick(config.courses[each.ref])"
        >
          <v-card-title class="text-h5 pb-2">
            {{ config.courses[each.ref]?.name }}
            <v-spacer />
            <v-btn v-if="onEdit" icon small @click.stop="courseOnMoveUp(index)">
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small @click.stop="courseOnMoveDown(index)">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small @click.stop="courseOnDelete(index)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small @click.stop="courseOnEdit(index)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            {{ each.time_start }} - {{ each.time_end }}
          </v-card-text>
        </v-card>
      </template>
      <v-card
        v-if="onEdit"
        class="bg-t mb-2"
        elevation="0"
        ripple
        @click="addCourse()"
      >
        <v-card-title class="text-h5 pb-2">
          <v-icon>mdi-plus</v-icon>
        </v-card-title>

        <v-card-text>
          添加新课程
        </v-card-text>
      </v-card>
      <template v-if="config.schedule[scheduleOfTheDay].length === 0">
        <p class="text-center pt-12">
          今日无课
          <br>好耶 !!!
        </p>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['config'],
  data: () => ({
    nowDate: new Date(),
    tempConfig: {},
    onEdit: false,
    onEditId: 0,
    editDialog: false,
    editStartTimeMenu: false,
    editEndTimeMenu: false,
    settingsDialog: false,
    aboutDialog: false,
    currentTime: ''
  }),
  computed: {
    scheduleOfTheDay () {
      return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
        this.nowDate.getDay()
      ]
    }
  },
  mounted () {
    this.updateCurrentTime()
    // clearInterval(myTimeDisplay)
    // eslint-disable-next-line no-unused-vars
    const myTimeDisplay = setInterval(() => {
      this.updateCurrentTime()
    }, 1000)
  },
  methods: {
    _deepcopy (object) {
      return JSON.parse(JSON.stringify(object))
    },
    updateCurrentTime () {
      const date = new Date()
      const hours = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const time = hours + ':' + minute + ':' + second
      this.currentTime = time
    },
    isTimeBetween (start, end, check) {
      const startTime = new Date(`01/01/2021 ${start}:00`).getTime()
      const endTime = new Date(`01/01/2021 ${end}:00`).getTime()
      const checkTime = new Date(`01/01/2021 ${check}`).getTime()
      return checkTime >= startTime && checkTime <= endTime
    },
    async courseOnClick (courseId) {
      await ipcRenderer.send('courseClick', courseId)
      console.log(courseId)
    },
    _generateTempConfig () {
      this.tempConfig = this._deepcopy(this.config)
    },
    async _saveTempConfig () {
      await ipcRenderer.send('saveConfig', this.tempConfig)
      await this.$nuxt.refresh()
    },
    async courseOnMoveUp (courseId) {
      // console.log(courseId)
      if (courseId === 0) {
        this.$dialog.error({
          text: 'You can\'t move this course up',
          title: 'Error'
        })
      } else {
        this._generateTempConfig()
        const temp = this._deepcopy(this.tempConfig.schedule[this.scheduleOfTheDay][courseId - 1])
        this.tempConfig.schedule[this.scheduleOfTheDay][courseId - 1] =
          this._deepcopy(this.tempConfig.schedule[this.scheduleOfTheDay][courseId])
        this.tempConfig.schedule[this.scheduleOfTheDay][courseId] = temp
        await this._saveTempConfig()
      }
    },
    async courseOnMoveDown (courseId) {
      if (courseId === this.config.schedule[this.scheduleOfTheDay].length - 1) {
        this.$dialog.error({
          text: 'You can\'t move this course down',
          title: 'Error'
        })
      } else {
        this._generateTempConfig()
        const temp = this._deepcopy(this.tempConfig.schedule[this.scheduleOfTheDay][courseId + 1])
        this.tempConfig.schedule[this.scheduleOfTheDay][courseId + 1] =
          this._deepcopy(this.tempConfig.schedule[this.scheduleOfTheDay][courseId])
        this.tempConfig.schedule[this.scheduleOfTheDay][courseId] = temp
        await this._saveTempConfig()
      }
    },
    async courseOnDelete (courseId) {
      const confirm = await this.$dialog.confirm({
        text: `Are you sure to delete course ${this.config.courses[this.config.schedule[this.scheduleOfTheDay][courseId].ref]?.name} ?`,
        title: 'Confirm',
        actions: [{
          text: 'Cancel', key: false
        }, {
          text: 'Delete', key: true
        }]
      })
      if (confirm === true) {
        this._generateTempConfig()
        this.tempConfig.schedule[this.scheduleOfTheDay].splice(courseId, 1)
        await this._saveTempConfig()
      }
    },
    courseOnEdit (courseId) {
      this.onEditId = courseId
      this._generateTempConfig()
      this.editDialog = true
    },
    async courseSaveEdit () {
      await this._saveTempConfig()
      this.editDialog = false
    },
    async addCourse () {
      this._generateTempConfig()
      const length = this.tempConfig.schedule[this.scheduleOfTheDay].length
      this.tempConfig.schedule[this.scheduleOfTheDay][length] = {
        ref: this._deepcopy(Object.entries(this.config.courses)[0][0]),
        time_start: '00:00',
        time_end: '00:00'
      }
      await this._saveTempConfig()
      this.courseOnEdit(length)
    },
    closeSettings () {
      this.settingsDialog = false
    },
    closeAbout () {
      this.aboutDialog = false
    },
    closeApp () {
      window.close()
    }
  }
}
</script>
<style>
.card-highlight-border {
  border: 2px solid #0D47A1 !important;
  margin: -2px;
}
.card-highlight {
  background-color: #0D47A1 !important;
}
</style>
