<template>
  <HomeHeader />
  <v-container>
    <HomePrinting />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomePrinting from '@/components/Home/HomePrinting.vue';

export default {
  name: 'PrintingForm',
  components: {
    HomeHeader,
    HomePrinting,
  }
};
</script>
