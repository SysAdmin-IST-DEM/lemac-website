<template>
  <v-sheet height="85vh">
    <RoomCalendar />
  </v-sheet>
</template>

<script>
import RoomCalendar from '@/components/RoomCalendar.vue';

export default {
  name: 'HomeRoomCalendar',
  components: { RoomCalendar },
};
</script>