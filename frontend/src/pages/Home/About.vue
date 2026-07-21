<template>
  <HomeHeader />

  <v-container>
    <HomeAbout />
  </v-container>
</template>

<script>
  import HomeAbout from '@/components/Home/HomeAbout.vue'
  import HomeHeader from '@/components/Home/HomeHeader.vue'

  export default {
    name: 'About',
    components: {
      HomeHeader,
      HomeAbout,
    },
  }
  </script>
