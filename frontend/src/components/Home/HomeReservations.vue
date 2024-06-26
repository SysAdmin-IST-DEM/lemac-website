<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" color="secondary" @click="setToday"> Today </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu bottom right offset-y>
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" v-bind="attrs" v-on="on" class="mr-3">
                <span>{{ filter == '' ? 'Room' : filter }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="filter = 'SDM'">
                <v-list-item-title>SDM</v-list-item-title>
              </v-list-item>
              <v-list-item @click="filter = 'MOM'">
                <v-list-item-title>MOM</v-list-item-title>
              </v-list-item>
              <v-list-item @click="filter = 'LTI'">
                <v-list-item-title>LTI</v-list-item-title>
              </v-list-item>
              <v-list-item @click="filter = ''">
                <v-list-item-title>Any</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu bottom right offset-y>
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
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
      </v-sheet>

      <v-sheet height="75vh">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="filteredEvents"
          :event-color="getEventColor"
          :type="type"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          @click:event="showEvent"
          interval-count="14"
          first-interval="8"
        >
          <template #interval="{ weekday, hour, date }">
            <div
              v-if="hour < 9 || hour >= 21"
              style="height: 100%; width: 100%; background-color: #f2f2f2"
            ></div>
            <div v-else style="height: 100%; width: 100%"></div>
          </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card v-if="selectedElement" color="grey lighten-4" min-width="250px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-if="selectedElement">{{
                selectedEvent.details.title
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <p>
                Classroom: <b>{{ selectedEvent.details.room }}</b>
              </p>
              <p>
                Entry:
                {{ formatTime(selectedEvent.details.entry) }}
              </p>
              <p>
                Exit:
                {{ formatTime(selectedEvent.details.exit) }}
              </p>
              <p v-if="typeof selectedEvent.details.id !== 'number'">
                Description: {{ selectedEvent.details.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getHoursFenix, getHours } from '@/api/room_hours.api';
import { getEvents } from '@/api/room_events.api';
import moment from 'moment';

export default {
  name: 'HomeReservations',
  components: {},
  data: () => ({
    focus: '',
    type: 'week',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    date: false,
    roomDropdown: '',
    dialog: false,
    dialogCard: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: { SDM: 'blue', MOM: 'green', LTI: 'orange' },
    editedItem: {
      entry: '',
      exit: '',
      date: '',
    },
    requested: [],
    items: ['SDM', 'MOM', 'LTI'],
    name: '',
    ist_id: '',
    filter: '',
    filteredEvents: [],
  }),
  watch: {
    events() {
      if (this.filter === '') {
        this.filteredEvents = [...this.events];
      } else {
        this.filteredEvents = this.events.filter((val) => val.details.room == this.filter);
      }
    },
    filter() {
      if (this.filter === '') {
        this.filteredEvents = [...this.events];
      } else {
        this.filteredEvents = this.events.filter((val) => val.details.room == this.filter);
      }
    },
  },
  mounted() {},
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      if (event.givenKey) {
        return `${event.color} darken-4`;
      } else {
        return event.color;
      }
    },

    setToday() {
      this.focus = '';
    },

    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
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

    async updateRange({ start, end }) {
      this.$loading.show();

      await this.pushEventsFenix();

      if (!this.requested.includes('' + start.month + start.year)) {
        await this.pushEvents(start.month, start.year);
        this.requested.push('' + start.month + start.year);
      }
      if (!this.requested.includes('' + end.month + end.year)) {
        await this.pushEvents(end.month, end.year);
        this.requested.push('' + end.month + end.year);
      }
      this.$loading.hide();
    },

    async pushEvents(month, year) {
      const date = new Date();
      const dates = [];
      date.setDate(date.getDate() - date.getDay());
      dates[0] = date.toISOString().slice(0, 10);
      date.setDate(date.getDate() + 6);
      dates[1] = date.toISOString().slice(0, 10);

      const events = [];
      const data = (await getHours(month, year)).data;
      const data_events = (await getEvents(dates[0], dates[1])).data;

      for (const event of data) {
        const data_event = data_events.filter((val) => val.roomId === event.id);
        event.title = `Reservation of ${event.user.name}`;
        event.events = data_event;

        events.push({
          name: event.title,
          start: moment(event.entry).utcOffset('+0000').format('YYYY-MM-DD HH:mm'),
          end: moment(event.exit).utcOffset('+0000').format('YYYY-MM-DD HH:mm'),
          color: this.colors[event.room],
          timed: true,
          id: event.id,
          givenKey: event.givenKey,
          details: event,
        });
      }

      this.events = events.concat(this.events);
    },

    async pushEventsFenix() {
      const events = [];
      let date;
      let curDate = this.focus ? new Date(this.focus) : new Date();

      if (curDate.getDay() == 0 || curDate.getDay() == 6) {
        curDate.setDate(curDate.getDate() + 2);
      }

      if (this.focus) {
        date = new Intl.DateTimeFormat('pt-PT', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(curDate);
      } else {
        date = new Intl.DateTimeFormat('pt-PT', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(curDate);
      }

      const data = (await getHoursFenix({ date })).data;

      for (const event of data) {
        if (!this.events.find((el) => el.id === event.id)) {
          events.push({
            name: event.title,
            start: moment(event.entry).format('YYYY-MM-DD HH:mm'),
            end: moment(event.exit).format('YYYY-MM-DD HH:mm'),
            color: this.colors[event.room],
            timed: true,
            id: event.id,
            givenKey: false,
            details: event,
          });
        }
      }

      this.events = events.concat(this.events);
    },

    formatTime(time) {
      return moment(time).utcOffset('+0000').format('HH:mm');
    },
  },
};
</script>
