<template>
  <v-app-bar
    density="compact"
  >
    <!-- Left side: Logo -->
    <router-link class="text-decoration-none" to="/">
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
        inset
        vertical
      />

      <router-link class="text-decoration-none" to="/about">
        <h2 class="text-black hover:text-[#009de0]! transition-colors duration-150 mx-3">
          About
        </h2>
      </router-link>

      <router-link class="text-decoration-none" to="/reservations">
        <h2 class="text-black hover:text-[#009de0]! transition-colors duration-150 mx-3">
          Reservations
        </h2>
      </router-link>

      <router-link class="text-decoration-none" to="/software">
        <h2 class="text-black hover:text-[#009de0]! transition-colors duration-150 mx-3">
          Software DEM
        </h2>
      </router-link>

      <router-link class="text-decoration-none" to="/printing">
        <h2 class="text-black hover:text-[#009de0]! transition-colors duration-150 mx-3">
          3DPrinting
        </h2>
      </router-link>

      <router-link class="text-decoration-none" to="/student-registration">
        <h2
          class="text-black hover:text-[#009de0]! transition-colors duration-150 mx-3 px-3
           border-1 border-solid rounded-xl"
          style="border-color: rgb(var(--v-theme-primary));"
        >
          Student Registration
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
        Monitor Login
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
    class="d-md-none"
    location="left"
    temporary
  >
    <v-list density="comfortable" nav>
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

  <v-alert
    color="warning"
    icon="$warning"
  >
    All students are now required to register in LEMAC’s system to access
    the room and other services. Please <RouterLink to="/student-registration">complete your registration</RouterLink>.
  </v-alert>
</template>

<script>
  import { mapActions, mapState } from 'pinia'
  import { apiLogin } from '@/api/auth.api'
  import { useUserStore } from '@/stores/user.js'
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
      ...mapState(useUserStore, ['getId']),
    },
    mounted () {
      const fenixCode = this.$route.query.code
      if (fenixCode && !this.disableLogin) this.authBackend(fenixCode)
    },
    methods: {
      login () {
        window.location = `${import.meta.env.VITE_FENIX_BASE_URL}oauth/userdialog?client_id=${import.meta.env.VITE_FENIX_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_FENIX_REDIRECT_URL}`
      },
      logout () {
        localStorage.removeItem('token')
        this.logoutUser()
        window.open('https://fenix.tecnico.ulisboa.pt/logout', '_blank').focus()
      },
      async authBackend (code) {
        try {
          const { data } = await apiLogin(code)
          if (data.jwt) {
            localStorage.setItem('token', data.jwt)
            this.loginUser(data.user)
          }
        } catch (error) {
          // print exception
          console.log(error)
          this.$notify({
            type: 'error',
            title: 'Unauthorized user',
            text: "You don't have permission to access this ",
            duration: -1,
          })
        }
        this.$router.push('login')
      },
      ...mapActions(useUserStore, ['loginUser', 'logoutUser']),
    },
  }
</script>
