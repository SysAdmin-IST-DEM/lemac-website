<template>
  <div class="home">
    <HomeHeader />
    <v-container>
      <RoomMap />
    </v-container>
  </div>
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
