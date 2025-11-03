<template>
  <HomeHeader />
  <v-container fluid>
    <HomeRoomCalendar />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeRoomCalendar from '@/components/Home/HomeRoomCalendar.vue';

export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeRoomCalendar,
  }
};
</script>
