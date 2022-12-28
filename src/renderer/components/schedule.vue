<template>
  <v-navigation-drawer permanent app width="220">
    <v-list-item>
      <v-list-item-content class="pt-1">
        <v-card-title class="text-h6 pa-0">
          Schedule
          <v-spacer />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="onEdit = !onEdit">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
            <span>Edit schedule</span>
          </v-tooltip>
        </v-card-title>
        <v-card-title class="pa-0">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                small class="pl-1 pr-1" v-bind="attrs"
                text v-on="on" @click="nowDate = new Date()"
              >
                {{ nowDate.toLocaleDateString() }} {{ scheduleOfTheDay }}
              </v-btn>
            </template>
            <span>Switch to current day</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon small v-bind="attrs"
                v-on="on" @click="nowDate.setDate(nowDate.getDate() - 1); nowDate = new Date(nowDate)"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <span>Previous day</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon small v-bind="attrs"
                v-on="on" @click="nowDate.setDate(nowDate.getDate() + 1); nowDate = new Date(nowDate)"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
            <span>Next day</span>
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
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit course {{ onEditId + 1 }}</span>
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="6">
                <v-subheader>
                  Ref to
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
                  Start time
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
                  End time
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
              color="blue darken-1"
              text
              @click="editDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveEdit()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <template v-for="(each, index) in config.schedule[scheduleOfTheDay]">
        <v-card :key="index" class="bg-t mb-2" elevation="0" ripple @click="courseOnClick(config.courses[each.ref])">
          <v-card-title class="text-h5 pb-2">
            {{ config.courses[each.ref].name }}
            <v-spacer />
            <v-btn v-if="onEdit" icon small>
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small>
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
      <!-- <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
    </v-list>
  </v-navigation-drawer>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  props: ['config'],
  data: () => ({
    nowDate: new Date(),
    onEdit: false,
    tempConfig: {},
    editDialog: false,
    onEditId: 0,
    editStartTimeMenu: false,
    editEndTimeMenu: false
  }),
  computed: {
    scheduleOfTheDay () {
      return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
        this.nowDate.getDay()
      ]
    }
  },
  mounted () {
    // console.log(this.nowDate)
  },
  methods: {
    courseOnClick (courseId) {
      ipcRenderer.send('courseClick', courseId)
      console.log(courseId)
    },
    _generateTempConfig () {
      this.tempConfig = JSON.parse(JSON.stringify(this.config)) // deep copy
    },
    _saveTempConfig () {
      ipcRenderer.send('saveConfig', this.tempConfig)
      this.$nuxt.refresh()
    },
    courseOnEdit (courseId) {
      this.onEditId = courseId
      this._generateTempConfig()
      this.editDialog = true
    },
    courseOnDelete (courseId) {
      this._generateTempConfig()
    },
    saveEdit () {
      this._saveTempConfig()
      this.editDialog = false
    }
  }
}
</script>
