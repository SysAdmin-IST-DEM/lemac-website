<template>
  <v-tabs grow>
    <v-tab key="1">
      Calendar
    </v-tab>
    <v-tab key="2">
      Event Log
    </v-tab>
    <v-window-item>
      <v-container>
        <RoomCalenderVue />
      </v-container>
    </v-window-item>
    <v-window-item>
      <v-container>
        <EventLogVue />
      </v-container>
    </v-window-item>
  </v-tabs>
</template>

<script>
import RoomCalenderVue from '@/components/RoomHours/RoomCalender.vue';
import EventLogVue from '@/components/RoomHours/EventLog.vue';

export default {
  name: 'Rooms',
  components: { RoomCalenderVue, EventLogVue },
  methods: {
    goHome() {
      window.location = '/';
    },
  },
};
</script>
