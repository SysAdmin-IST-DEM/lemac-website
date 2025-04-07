<template>
  <v-tabs
    v-model="tab"
    grow
  >
    <v-tab value="1">
      Calendar
    </v-tab>
    <v-tab value="2">
      Event Log
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-window-item value="1">
      <v-container>
        <RoomCalenderVue />
      </v-container>
    </v-window-item>
    <v-window-item value="2">
      <v-container>
        <EventLogVue />
      </v-container>
    </v-window-item>
  </v-tabs-window>
</template>

<script>
import RoomCalenderVue from '@/components/RoomHours/RoomCalender.vue';
import EventLogVue from '@/components/RoomHours/EventLog.vue';

export default {
  name: 'Rooms',
  components: { RoomCalenderVue, EventLogVue },
  data: () => ({
    tab: null,
  }),
  methods: {
    goHome() {
      window.location = '/';
    },
  },
};
</script>
