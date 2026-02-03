<template>
  <LemacCalendar
    ref="lemacCalendar"
    :events="events"
    :filter="filter"
    @change="updateRange"
  >
    <template #dropdowns>
      <slot name="extra-dropdowns" />

      <DashboardSelect
        v-model="room"
        :items="['SDM', 'MOM', 'LTI', { label: 'Any', value: null }]"
        default-label="Room"
      />
    </template>

    <template #event-details="{ event }">
      <p>
        Classroom: <b>{{ event.details.room }}</b>
      </p>
      <p>
        Entry:
        {{ DateTime.fromJSDate(event.start).toFormat('HH:mm') }}
      </p>
      <p>
        Exit:
        {{ DateTime.fromJSDate(event.end).toFormat('HH:mm') }}
      </p>
      <p v-if="typeof event.details.id !== 'number'">
        Description: {{ event.details.description }}
      </p>

      <slot name="extra-event-details" :event="event" />
    </template>

    <template #event-details-actions="{ event }">
      <slot name="extra-event-details-actions" :event="event" />
    </template>
  </LemacCalendar>
</template>

<script>
import { getHoursFenix, getHours } from '@/api/room_hours.api';
import { getEvents } from '@/api/room_events.api';
import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue';
import DashboardSelect from '@/components/Dashboard/DashboardDataTable/DashboardSelect.vue';
import { DateTime } from 'luxon';

export default {
  name: 'RoomCalendar',
  computed: {
    DateTime() {
      return DateTime
    }
  },
  components: { DashboardSelect, LemacCalendar },
  props: {
    extraFilter: {
      type: Function,
      default: () => () => true,
    },
  },
  data: () => ({
    room: null,
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
      const dates = [];
      const now = DateTime.now();
      dates[0] = now.minus({ days: now.weekday }).startOf('day');
      dates[1] = now.plus({ days: 7 - now.weekday }).startOf('day');

      const data = (await getHours(month, year)).data;
      const data_events = (await getEvents(dates[0], dates[1])).data;

      for (const event of data) {
        const data_event = data_events.filter((val) => val.roomReservationId === event.id);
        event.title = `Reservation of ${event.name}`;
        event.events = data_event;

        if (!this.events.find((el) => el.id === event.id)) {
          this.events.push({
            id: event.id,
            title: event.title,
            start: DateTime.fromISO(event.entry).toUTC().toFormat("yyyy-MM-dd HH:mm"),
            end: DateTime.fromISO(event.exit).toUTC().toFormat("yyyy-MM-dd HH:mm"),
            customColor: this.colors[event.room] + (event.givenKey ? ' darken-4' : ''),
            class: "bg-" + this.colors[event.room] + (event.givenKey ? '-darken-4' : ''),
            givenKey: event.givenKey,
            details: event
          });
        }
      }
    },
    async pushEventsFenix(start) {
      const date = DateTime.fromJSDate(start).plus({ days: 1 }).toFormat('dd/MM/yyyy');

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