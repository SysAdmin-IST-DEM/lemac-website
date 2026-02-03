<template>
  <HomeHeader />
  <v-alert
    color="warning"
    icon="$warning"
  >
    Starting <b>March 1, 2026</b>, all students are required to register in LEMAC’s entry system to access
    the room. Please <RouterLink to="/student-registration">complete your registration</RouterLink>.
  </v-alert>
  <v-container>
    <RoomMap />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import RoomMap from '@/components/Home/RoomMap.vue';
export default {
  name: 'Home',
  components: {
    HomeHeader,
    RoomMap,
  }
};
</script>
