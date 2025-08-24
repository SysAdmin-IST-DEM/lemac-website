<template>
  <LemacCalendar
    ref="lemacCalendar"
    :events="events"
    :filter="filter"
    @change="updateRange"
  >
    <template #dropdowns>
      <slot name="extra-dropdowns" />

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

    <template #event-details="{ event }">
      <p>
        Classroom: <b>{{ event.details.room }}</b>
      </p>
      <p>
        Entry:
        {{ $moment(event.start).format('HH:mm') }}
      </p>
      <p>
        Exit:
        {{ $moment(event.end).format('HH:mm') }}
      </p>
      <p v-if="typeof event.details.id !== 'number'">
        Description: {{ event.details.description }}
      </p>

      <slot
        name="extra-event-details"
        :event="event"
      />
    </template>

    <template #event-details-actions="{ event }">
      <slot
        name="extra-event-details-actions"
        :event="event"
      />
    </template>
  </LemacCalendar>
</template>

<script>
import { getHoursFenix, getHours } from '@/api/room_hours.api';
import { getEvents } from '@/api/room_events.api';
import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue';
import moment from 'moment';

export default {
  name: 'RoomCalendar',
  components: { LemacCalendar },
  props: {
    extraFilter: {
      type: Function,
      default: () => () => true,
    },
  },
  data: () => ({
    room: undefined,
    events: [],
    colors: { SDM: 'blue', MOM: 'green', LTI: 'orange' },
    requested: [],
  }),
  watch: {},
  mounted() {},
  methods: {
    getVueCal() {
      return this.$refs.lemacCalendar?.getVueCal();
    },
    filter(event) {
      if (this.room) {
        return event.details.room === this.room && this.extraFilter(event);
      }
      return this.extraFilter(event);
    },
    async updateRange({ start, end }) {
      this.$loading.show();

      await this.pushEventsFenix(start);
      if (!this.requested.includes('' + (start.getMonth() + 1) + start.getFullYear())) {
        await this.pushEvents((start.getMonth() + 1), start.getFullYear());
        this.requested.push('' + (start.getMonth() + 1) + start.getFullYear());
      }
      if (!this.requested.includes('' + (end.getMonth() + 1) + end.getFullYear())) {
        await this.pushEvents((end.getMonth() + 1), end.getFullYear());
        this.requested.push('' + (end.getMonth() + 1) + end.getFullYear());
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
            id: event.id,
            title: event.title,
            start: moment(event.entry).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
            end: moment(event.exit).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
            customColor: this.colors[event.room] + (event.givenKey ? ' darken-4' : ''),
            class: "bg-" + this.colors[event.room] + (event.givenKey ? '-darken-4' : ''),
            givenKey: event.givenKey,
            details: event
          });
        }
      }
    },
    async pushEventsFenix(start) {
      const date = moment(start).add(1, 'day').format('DD/MM/YYYY');

      const data = (await getHoursFenix({ date })).data;

      for (const event of data) {
        if (!this.events.find((el) => el.id === event.id)) {
          this.events.push({
            id: event.id,
            title: event.title,
            start: new Date(event.entry),
            end: new Date(event.exit),
            customColor: this.colors[event.room] + (event.givenKey ? ' darken-4' : ''),
            class: "bg-" + this.colors[event.room] + (event.givenKey ? '-darken-4' : ''),
            givenKey: false,
            details: event,
          });
        }
      }
    },
  },
};
</script>