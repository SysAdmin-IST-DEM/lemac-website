<template>
  <v-calendar
    v-model="date"
    v-bind="props"
    :events="filteredEvents"
    :view-mode="type"
    :interval-start="8"
    :intervals="14"
    class="bg-white"
    @click:date="viewDay"
    @click:event="showEvent"
    @update:model-value="onChange"
  >
    <template #header="{ title, clickNext, clickPrev, clickToday }">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="ml-4 mr-4" color="secondary" variant="elevated" @click="clickToday">
            Today
          </v-btn>
          <v-btn icon variant="text" size="small" color="grey-darken-2" @click="clickPrev">
            <v-icon size="small"> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small" color="grey-darken-2" @click="clickNext">
            <v-icon size="small"> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
          <v-spacer />

          <slot name="dropdowns" />

          <!-- Type select -->
          <v-menu location="bottom right">
            <template #activator="{ props }">
              <v-btn color="secondary" variant="elevated" class="mr-4" v-bind="props">
                <span>{{ type }}</span>
                <v-icon end> mdi-menu-down </v-icon>
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
    </template>
  </v-calendar>
  <v-menu
    v-model="showEventOpen"
    :activator="selectedEventActivator"
    :close-on-content-click="false"
  >
    <v-card color="grey-lighten-4" min-width="250px" flat>
      <v-toolbar :color="selectedEvent.color">
        <v-toolbar-title>
          {{ selectedEvent.title }}
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <p>
          Classroom: <b>{{ selectedEvent.details.room }}</b>
        </p>
        <p>
          Entry:
          {{ moment(selectedEvent.details.entry).format('HH:mm') }}
        </p>
        <p>
          Exit:
          {{ moment(selectedEvent.details.exit).format('HH:mm') }}
        </p>
        <p v-if="typeof selectedEvent.details.id !== 'number'">
          Description: {{ selectedEvent.details.description }}
        </p>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style>
.v-calendar-weekly__head-weekday .v-calendar-day-label__today {
  background-color: rgba(var(--v-theme-secondary)) !important;
  color: white !important;
}

.v-calendar__container {
  overflow-y: auto;
}
</style>

<script>
import moment from 'moment';

export default {
  name: 'LemacCalendar',
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Function,
      default: () => { return true },
    },
    props: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    filteredEvents() {
      return this.events.filter(event => this.filter(event));
    },
  },
  emits: ['change'],
  data() {
    return {
      date: [new Date()],
      type: 'week',
      showEventOpen: false,
      selectedEvent: undefined,
      selectedEventActivator: undefined
    };
  },
  watch: {
    events() {
      console.log(this.events);
    },
  },
  methods: {
    moment,
    viewDay() {
      this.date = [new Date()];
      this.type = 'day';
    },
    onChange(date) {
      const start = moment(this.date[0]).startOf(this.type).toDate();
      const end = moment(this.date[0]).endOf(this.type).toDate();
      this.$emit('change', { start, end });
    },
    showEvent(e, { event }) {
      console.log('CLICKED', event);
      this.selectedEvent = event;
      this.selectedEventActivator = e.target;
      this.showEventOpen = true;
    },
  },
};
</script>