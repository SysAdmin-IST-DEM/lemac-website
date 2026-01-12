<template>
  <HomeHeader />
  <v-container>
    <HomeAbout />
  </v-container>
</template>

<script>
  import HomeHeader from '@/components/Home/HomeHeader.vue';
  import HomeAbout from '@/components/Home/HomeAbout.vue';

  export default {
    name: 'About',
    components: {
        HomeHeader,
        HomeAbout
    }
  };
  </script>
