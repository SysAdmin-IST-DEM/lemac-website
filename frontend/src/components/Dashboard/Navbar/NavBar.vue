<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="lgAndUp"
    >
      <v-list
        v-model:selected="group"
        nav
      >
        <v-list-item
          v-for="(route, index) in filteredRoutes"
          :key="index"
          :value="index"
          :to="route.link"
          class="mb-1"
        >
          <v-icon
            v-if="route.icon"
            start
          >
            {{ route.icon }}
          </v-icon>
          {{ route.text }}
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            @click="onLogout"
          >
            <v-icon start>
              mdi-logout
            </v-icon>Logout
          </v-btn>
          <div class="py-2 text-center">
            LEMAC
            <v-icon size="x-small">
              mdi-copyright
            </v-icon>
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      density="compact"
      :order="mdAndDown ? 0 : -1"
    >
      <v-app-bar-nav-icon
        v-if="mdAndDown"
        color="primary"
        @click.stop="drawer = !drawer"
      />
      <v-spacer />
      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        location="bottom"
        color="primary"
      />
    </v-app-bar>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
const { lgAndUp, mdAndDown } = useDisplay()
</script>

<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import { useLoadingStore } from '@/stores/loading.js';

export default {
  name: 'NavBar',

  data() {
    return {
      drawer: true,
      group: null,
      routes: [
        {
          text: 'Home',
          icon: 'mdi-home',
          link: '/',
        },
        {
          text: 'Dashboard',
          icon: 'mdi-view-dashboard',
          link: '/dashboard',
        },
        {
          text: "Hours' Registry",
          icon: 'mdi-clock',
          link: '/dashboard/hours',
        },
        {
          text: "Monitor's Schedule",
          icon: 'mdi-calendar-clock',
          link: '/dashboard/schedule',
        },
        {
          text: 'User Management',
          icon: 'mdi-account-multiple',
          link: '/dashboard/users',
        },
        {
          text: 'Workstations',
          icon: 'mdi-desktop-classic',
          link: '/dashboard/workstations',
        },
        {
          text: 'Announcements',
          icon: 'mdi-bullhorn-variant',
          link: '/dashboard/publications',
          permission: 1,
        },
        {
          text: 'Room Management',
          icon: 'mdi-table-chair',
          link: '/dashboard/rooms',
        },
        {
          text: '3D Printing',
          icon: 'mdi-printer-3d',
          link: '/dashboard/printing',
        },
      ],
    };
  },

  computed: {
    filteredRoutes() {
      return this.routes.filter(
        (route) => this.getPermission >= (route.permission || 0)
      );
    },
    ...mapState(useUserStore, ['getPermission']),
    ...mapState(useLoadingStore, ['isLoading']),
  },

  watch: {
    group() {
      this.drawer = true;
    },
  },

  methods: {
    onLogout: function () {
      localStorage.removeItem('token');
      this.logoutUser();
      this.$router.push('/');
      window.open('https://fenix.tecnico.ulisboa.pt/logout', '_blank').focus();
    },

    ...mapActions('user', ['logoutUser']),
  },
};
</script>
