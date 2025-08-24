<template>
  <div class="home">
    <HomeHeader
      :loading="loading"
      :loading-out="false"
      @login="login"
      @logout="logout"
    />
    <v-container>
      <HomeAbout />
    </v-container>
  </div>
</template>

<script>
  import HomeHeader from '@/components/Home/HomeHeader.vue';
  import { apiLogin } from '@/api/auth.api';
  import { mapActions } from 'vuex';
  import HomeAbout from '@/components/Home/HomeAbout.vue';

  export default {
    name: 'Home',
    components: {
    HomeHeader,
    HomeAbout
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
      },
      ...mapActions('user', ['loginUser', 'logoutUser']),
    },
  };
  </script>
