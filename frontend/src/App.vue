<template>
  <v-app id="app" style="width: 100%; height: 100%">
    <notifications />
    <component :is="$route.meta.navBar"></component>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import { getProfile } from '@/api/auth.api';
export default {
  name: 'App',

  async mounted() {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      const profile = await getProfile();
      if (profile) this.loginUser(profile);
    }
  },

  methods: {
    ...mapActions('user', ['loginUser']),
  },
};
</script>

<style>
body,
html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto !important;
}
#app {
  background-color: var(--v-background-base);
}
.theme--light.v-tabs-items {
  background-color: #eef2f5;
}
</style>
