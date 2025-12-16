<template>
  <HomeHeader disable-login />
  <v-container>
    <HomePrinting />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomePrinting from '@/components/Home/HomePrinting.vue';

export default {
  name: 'RequestPrinting',
  components: {
    HomeHeader,
    HomePrinting,
  },
};
</script>
