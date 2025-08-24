<template>
  <div class="home">
    <HomeHeader />
    <v-container>
      <HomeAbout />
    </v-container>
  </div>
</template>

<script>
  import HomeHeader from '@/components/Home/HomeHeader.vue';
  import HomeAbout from '@/components/Home/HomeAbout.vue';

  export default {
    name: 'Home',
    components: {
        HomeHeader,
        HomeAbout
    }
  };
  </script>
