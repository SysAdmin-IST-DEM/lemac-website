<template>
  <v-app-bar
    density="compact"
  >
    <router-link to="/">
      <h2 class="mx-3 text-primary">
        LEMAC
      </h2>
    </router-link>
    <v-divider
      class="border-opacity-100"
      vertical
      inset
    />
    <router-link to="/about">
      <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
        About
      </h2>
    </router-link>
    <router-link to="/reservations">
      <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
        Reservations
      </h2>
    </router-link>
    <router-link to="/software">
      <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
        Software DEM
      </h2>
    </router-link>
    <router-link to="/printing">
      <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
        3DPrinting
      </h2>
    </router-link>
    <v-spacer />
    <div v-if="!getId">
      <v-btn
        class="mx-3 bg-primary"
        elevation="2"
        size="small"
        @click="login"
      >
        Login
      </v-btn>
    </div>
    <div v-else>
      <v-tooltip
        location="bottom"
        open-delay="500"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            @click="$router.push('dashboard')"
          >
            mdi-view-dashboard
          </v-icon>
        </template>
        Admin Dashboard
      </v-tooltip>
      <v-btn
        class="mx-3 bg-error"
        elevation="2"
        size="small"
        @click="logout()"
      >
        Logout
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { apiLogin } from '@/api/auth.api.js';
export default {
  name: 'HomeHeader',
  props: {
    disableLogin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('user', ['getId']),
  },
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode && !this.disableLogin) this.authBackend(fenixCode);
  },
  methods: {
    login() {
      window.location = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL}`;
    },
    logout() {
      localStorage.removeItem('token');
      this.logoutUser();
      window.open('https://fenix.tecnico.ulisboa.pt/logout', '_blank').focus();
    },
    async authBackend(code) {
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
      this.$router.push('login');
    },
    ...mapActions('user', ['loginUser', 'logoutUser'])
  }
};
</script>