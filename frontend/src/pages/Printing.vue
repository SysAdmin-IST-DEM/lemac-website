<template>
  <div class="home">
    <HomeHeader />
    <v-container>
      <HomePrinting />
    </v-container>
  </div>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import { apiLogin } from '@/api/auth.api';
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
