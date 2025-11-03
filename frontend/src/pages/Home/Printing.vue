<template>
  <HomeHeader />
  <v-container>
    <HomePrinting />
  </v-container>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import { apiLogin } from '@/api/auth.api.js';
import { mapActions } from 'vuex';
import HomePrinting from '@/components/Home/HomePrinting.vue';

export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomePrinting,
  }
};
</script>
