<template>
  <HomeHeader />

  <v-container>
    <HomePrinting />
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import { apiLogin } from '@/api/auth.api.js'
  import HomeHeader from '@/components/Home/HomeHeader.vue'
  import HomePrinting from '@/components/Home/HomePrinting.vue'

  export default {
    name: 'Home',
    components: {
      HomeHeader,
      HomePrinting,
    },
  }
</script>
