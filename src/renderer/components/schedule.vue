<template>
  <v-navigation-drawer permanent app width="220">
    <v-list-item>
      <v-list-item-content class="pt-1">
        <v-card-title class="text-h6 pa-0">
          Schedule
          <v-spacer />
          <v-btn icon @click="onEdit = !onEdit">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title class="pa-0">
        <v-btn small class="pl-1 pr-1" text>
          {{ date.toLocaleDateString() }} {{ scheduleOfTheDay }}
        </v-btn>
        <v-spacer />
        <v-btn icon small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon small>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        </v-card-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list nav>
      <template v-for="(each, index) in config.schedule[scheduleOfTheDay]">
        <v-card :key="index" class="bg-t mb-2" elevation="0" ripple>
          <v-card-title class="text-h5 pb-2">
            {{ config.courses[each.ref].name }}
            <v-spacer />
            <v-btn v-if="onEdit" icon small>
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small>
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small>
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
            <v-btn v-if="onEdit" icon small>
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
export default {
  props: ['config'],
  data: () => ({
    date: new Date(),
    onEdit: false
  }),
  computed: {
    scheduleOfTheDay () {
      return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
        this.date.getDay()
      ]
    }
  }
}
</script>
