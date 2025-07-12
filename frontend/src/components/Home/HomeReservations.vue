<template>
  <v-sheet height="85vh">
    <LemacCalendar
      :events="events"
      :filter="filter"
      @change="updateRange"
    >
      <template #dropdowns>
        <v-menu location="bottom right">
          <template #activator="{ props }">
            <v-btn color="secondary" variant="elevated" class="mr-4" v-bind="props">
              <span>{{ room ?? 'Room' }}</span>
              <v-icon end>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(r, index) in ['SDM', 'MOM', 'LTI']"
              :key="index"
              @click="room = r"
            >
              <v-list-item-title>{{ r }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="room = undefined">
              <v-list-item-title>Any</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </LemacCalendar>
  </v-sheet>
</template>

<script>
import { getHoursFenix, getHours } from '@/api/room_hours.api';
import { getEvents } from '@/api/room_events.api';
import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue';

export default {
  name: 'HomeReservations',
  components: { LemacCalendar },
  data: () => ({
    room: undefined,
    events: [],
    colors: { SDM: 'blue', MOM: 'green', LTI: 'orange' },
    requested: [],
    name: '',
    ist_id: '',
  }),
  watch: {},
  mounted() {},
  methods: {
    filter(event) {
      if (this.room) {
        return event.details.room === this.room;
      }
      return true;
    },
    async updateRange({ start, end }) {
      this.$loading.show();

      await this.pushEventsFenix();
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
      const date = new Date();
      const dates = [];
      date.setDate(date.getDate() - date.getDay());
      dates[0] = date.toISOString().slice(0, 10);
      date.setDate(date.getDate() + 6);
      dates[1] = date.toISOString().slice(0, 10);

      const data = (await getHours(month, year)).data;
      const data_events = (await getEvents(dates[0], dates[1])).data;

      for (const event of data) {
        const data_event = data_events.filter((val) => val.roomId === event.id);
        event.title = `Reservation of ${event.user.name}`;
        event.events = data_event;

        if (!this.events.find((el) => el.id === event.id)) {
          this.events.push({
            title: event.title,
            start: new Date(event.entry),
            end: new Date(event.exit),
            color: this.colors[event.room] + (event.givenKey ? ' darken-4' : ''),
            id: event.id,
            givenKey: event.givenKey,
            details: event,
            allDay: false
          });
        }
      }
    },
    async pushEventsFenix() {
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
          this.events.push({
            title: event.title,
            start: new Date(event.entry),
            end: new Date(event.exit),
            diff: (new Date(event.exit) - new Date(event.entry)) / (1000 * 60), // in minutes
            color: this.colors[event.room] + (event.givenKey ? ' darken-4' : ''),
            id: event.id,
            givenKey: false,
            details: event,
          });
        }
      }
    },
  },
};
</script>
