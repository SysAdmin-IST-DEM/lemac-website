<template>
  <VueCal
    ref="vuecal"
    v-bind="$attrs"
    :events="filteredEvents"
    :view="type"
    :start-week-on-sunday="startWeekOnSunday"
    :events-on-month-view="true"
    :time-from="480"
    :time-to="timeTo"
    style="height: auto"
    @click:date="viewDay"
    @event-click="showEvent"
    @ready="onReady"
    @view-change="onChange"
  >
    <template #header="{ view }">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            class="ml-4 mr-4"
            color="secondary"
            variant="elevated"
            @click="view.goToToday"
          >
            Today
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            color="grey-darken-2"
            @click="view.previous"
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
            @click="view.next"
          >
            <v-icon size="small">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>
            <span v-html="view.title" />
          </v-toolbar-title>
          <v-spacer />

          <slot name="dropdowns" />

          <!-- Type select -->
          <v-menu location="bottom right">
            <template #activator="{ props }">
              <v-btn
                color="secondary"
                variant="elevated"
                class="mr-4"
                v-bind="props"
              >
                <span>{{ type }}</span>
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
      </v-sheet>
    </template>
  </VueCal>
  <v-menu
    v-model="showEventOpen"
    :activator="selectedEventActivator"
    :close-on-content-click="false"
  >
    <v-card
      color="grey-lighten-4"
      min-width="250px"
      flat
    >
      <v-toolbar :color="selectedEvent.customColor">
        <v-toolbar-title>
          {{ selectedEvent.title }}
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <slot
          name="event-details"
          :event="selectedEvent"
        />
      </v-card-text>
      <v-card-actions>
        <slot
          name="event-details-actions"
          :event="selectedEvent"
        />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { VueCal } from 'vue-cal';

export default {
  name: 'LemacCalendar',
  inheritAttrs: false,
  components: {
    VueCal,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Function,
      default: () => {
        return true;
      },
    },
    defaultView: {
      type: String,
      default: 'week',
    },
    clickableEvent: {
      type: Boolean,
      default: true
    },
    timeTo: {
      type: Number,
      default: 1320,
    },
    startWeekOnSunday: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'event-click'],
  data() {
    return {
      type: this.defaultView,
      showEventOpen: false,
      selectedEvent: undefined,
      selectedEventActivator: undefined,
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        return this.filter(event)
      });
    },
  },
  methods: {
    getVueCal() {
      return this.$refs.vuecal;
    },
    viewDay() {
      this.type = 'day';
    },
    onReady({ config, view }) {
      this.$emit('change', view);
    },
    onChange(event) {
      this.$emit('change', event);
    },
    showEvent({ e, event }) {
      this.$emit('event-click', { e, event });
      if(!this.clickableEvent || this.showEventOpen) return;
      this.selectedEvent = event;
      this.selectedEventActivator = e.target;
      this.showEventOpen = true;
    },
    closeEvent() {
      this.showEventOpen = false;
    }
  },
};
</script>

<style scoped>
.vuecal--default-theme {
  --vuecal-primary-color: rgb(var(--v-theme-secondary));
  --vuecal-secondary-color: #fff;
}

::v-deep(.vuecal__cell--selected:before),
::v-deep(.vuecal__cell--today:before),
::v-deep(.vuecal__scrollable-wrap) {
  background-color: transparent !important;
}

::v-deep(.vuecal__weekday) {
  flex-direction: column !important;
}

::v-deep(.vuecal__event) {
  border: 1px solid white !important;
}

::v-deep(.vuecal__event-details) {
  color: white !important;
}

::v-deep(.vuecal__event-details:hover) {
  cursor: pointer;
}
</style>