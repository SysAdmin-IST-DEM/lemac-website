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
        <EventLog />
      </v-container>
    </v-window-item>
  </v-tabs-window>
</template>

<script>
import RoomCalenderVue from '@/components/Dashboard/RoomHours/RoomCalender.vue';
import EventLog from '@/components/Dashboard/RoomHours/EventLog.vue';

export default {
  name: 'Rooms',
  components: { RoomCalenderVue, EventLog },
  data: () => ({
    tab: null,
  }),
};
</script>
