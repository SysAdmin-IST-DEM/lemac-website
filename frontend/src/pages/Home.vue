<template>
  <div class="home">
    <HomeHeader :loading="loading" :loading-out="false" @login="login" @logout="logout" />
    <v-container>
      <RoomMap />
    </v-container>
  </div>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import RoomMap from '@/components/Home/RoomMap.vue';
import { apiLogin } from '@/api/auth.api';
import { mapActions } from 'vuex';
export default {
  name: 'Home',
  components: {
    HomeHeader,
    RoomMap,
  },
  data: () => ({
    loading: false,
    loadingOut: false,
  }),
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode) this.authBackend(fenixCode);
  },
  methods: {
    login() {
      window.location = `${process.env.VUE_APP_FENIX_BASE_URL}oauth/userdialog?client_id=${process.env.VUE_APP_FENIX_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_FENIX_REDIRECT_URL}`;
    },
    //only runs after fenix login
    async authBackend(code) {
      this.loading = true;
      try {
        const { data } = await apiLogin(code);
        if (data.jwt) {
          localStorage.setItem('token', data.jwt);
          this.loginUser(data.user);
        }
      } catch (e) {
        //print exception
        console.log(e);
        this.$notify({
          type: 'error',
          title: 'Unauthorized user',
          text: "You don't have permission to access this ",
          duration: -1,
        });
      }
      this.loading = false;
      this.$router.push('login');
    },
    logout() {
      this.loadingOut = true;
      localStorage.removeItem('token');
      this.logoutUser();
      this.loadingOut = false;
      window.open('https://fenix.tecnico.ulisboa.pt/logout', '_blank').focus();
    },
    ...mapActions('user', ['loginUser', 'logoutUser']),
  },
};
</script>
