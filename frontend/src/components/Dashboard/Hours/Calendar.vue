<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :view-mode="type"
          interval-count="14"
          first-interval="8"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @update:model-value="updateRange"
        >
          <template #header=" { title }">
            <v-toolbar flat>
              <v-btn
                class="mr-4 ml-4"
                color="secondary"
                variant="elevated"
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="grey-darken-2"
                @click="prev"
              >
                <v-icon size="small">
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                color="grey-darken-2"
                @click="next"
              >
                <v-icon size="small">
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ title }}
              </v-toolbar-title>
              <v-spacer />
              <v-menu
                location="bottom right"
                offset-y
              >
                <template #activator="{ props }">
                  <v-btn
                    color="secondary"
                    variant="elevated"
                    v-bind="props"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon end>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <template #interval="{ weekday, hour, date }">
            <div
              v-if="hour < 9 || hour >= 21"
              style="height: 100%; width: 100%; background-color: #f2f2f2"
            />
            <div
              v-else
              style="height: 100%; width: 100%"
            />
          </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            v-if="selectedElement"
            color="grey-lighten-4"
            min-width="250px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              theme="dark"
            >
              <v-toolbar-title v-if="selectedElement">
                {{
                  selectedEvent.details.user.name
                }}
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <p>
                Entry:
                {{
                  new Date(selectedEvent.details.entry).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <p>
                Exit:
                {{
                  new Date(selectedEvent.details.exit).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <p>
                Time: {{ Math.floor(parseInt(selectedEvent.details.time) / 60) }}h{{
                  parseInt(selectedEvent.details.time % 60) || ''
                }}
              </p>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getHours } from '@/api/hours.api.js';
import moment from 'moment';
import { useDate } from 'vuetify'

export default {
  data: () => ({
    focus: [new Date()],
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    requested: [],
  }),
  mounted() {
    this.updateRange(this.focus)
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = [new Date()];
    },
    prev() {
      const date = this.focus[0];
      if (this.type === 'day') {
        this.focus = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)]
      } else if (this.type === 'week') {
        this.focus = [new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)]
      } else {
        this.focus = [new Date(date.getFullYear(), date.getMonth() - 1, 1)]
      }
    },
    next() {
      const date = this.focus[0];
      if (this.type === 'day') {
        this.focus = [new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)]
      } else if (this.type === 'week') {
        this.focus = [new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)]
      } else {
        this.focus = [new Date(date.getFullYear(), date.getMonth() + 1, 1)]
      }
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async updateRange(value) {
      this.$loading.show();
      const date = value[0];
      const adapter = useDate();

      let start, end
      if (this.type === 'week') {
        start = adapter.startOfWeek(date)
        end   = adapter.endOfWeek(date)
      } else if (this.type === 'month') {
        start = adapter.startOfMonth(date)
        end   = adapter.endOfMonth(date)
      } else {
        start = new Date(date)
        end   = new Date(date)
      }

      if (!this.requested.includes('' + start.getMonth() + start.getFullYear())) {
        await this.pushEvents(start.getMonth(), start.getFullYear());
        this.requested.push('' + start.getMonth() + start.getFullYear());
      }
      if (!this.requested.includes('' + end.getMonth() + end.getFullYear())) {
        await this.pushEvents(end.getMonth(), end.getFullYear());
        this.requested.push('' + end.getMonth() + end.getFullYear());
      }
      this.$loading.hide();
    },
    async pushEvents(month, year) {
      const events = [];
      const allHours = (await getHours(month, year)).data;
      //   const min = new Date(`${start.date}T00:00:00`);
      //   const max = new Date(`${end.date}T23:59:59`);
      for (let i = 0; i < allHours.length; i++) {
        events.push({
          title: allHours[i].user.name.split(' ')[0],
          start: moment(allHours[i].entry).toDate(),
          end: moment(allHours[i].exit).toDate(),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          allDay: false,
          details: allHours[i],
        });
      }
      this.events = events.concat(this.events);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
