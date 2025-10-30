<template>
  <v-app-bar
    density="compact"
  >
    <!-- Left side: Logo -->
    <router-link to="/" class="text-decoration-none">
      <h2 class="mx-3 text-primary">
        LEMAC
      </h2>
    </router-link>

    <!-- MOBILE: burger icon -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = true"
    />

    <!-- DESKTOP: inline nav links -->
    <div class="d-none d-md-flex align-center">
      <v-divider
        class="border-opacity-100"
        vertical
        inset
      />
      <router-link to="/about" class="text-decoration-none">
        <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
          About
        </h2>
      </router-link>
      <router-link to="/reservations" class="text-decoration-none">
        <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
          Reservations
        </h2>
      </router-link>
      <router-link to="/software" class="text-decoration-none">
        <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
          Software DEM
        </h2>
      </router-link>
      <router-link to="/printing" class="text-decoration-none">
        <h2 class="text-black hover:text-[#009de0] transition-colors duration-150 mx-3">
          3DPrinting
        </h2>
      </router-link>
    </div>

    <v-spacer />

    <!-- AUTH AREA -->
    <div
      v-if="!getId"
      class="d-flex align-center"
    >
      <v-btn
        class="mx-3 bg-primary"
        elevation="2"
        size="small"
        @click="login"
      >
        Login
      </v-btn>
    </div>

    <div
      v-else
      class="d-flex align-center"
    >
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
        @click="logout"
      >
        Logout
      </v-btn>
    </div>
  </v-app-bar>

  <!-- NAVIGATION DRAWER (mobile) -->
  <v-navigation-drawer
    v-model="drawer"
    location="left"
    temporary
    class="d-md-none"
  >
    <v-list nav density="comfortable">
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        @click="$router.push('/')"
      />
      <v-list-item
        prepend-icon="mdi-information-outline"
        title="About"
        @click="$router.push('about')"
      />
      <v-list-item
        prepend-icon="mdi-calendar-clock"
        title="Reservations"
        @click="$router.push('reservations')"
      />
      <v-list-item
        prepend-icon="mdi-laptop"
        title="Software DEM"
        @click="$router.push('software')"
      />
      <v-list-item
        prepend-icon="mdi-cube-scan"
        title="3DPrinting"
        @click="$router.push('printing')"
      />

      <v-divider class="my-3" />

      <template v-if="!getId">
        <v-list-item
          prepend-icon="mdi-login"
          title="Login"
          @click="login"
        />
      </template>
      <template v-else>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="$router.push('dashboard')"
        />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="logout"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
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
  data: () => ({
    drawer: false,
  }),
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