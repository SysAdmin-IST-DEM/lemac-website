<template>
  <div>
    <v-navigation-drawer v-model="drawer" :permanent="lgAndUp">
      <v-list v-model:selected="group" nav>
        <v-list-item
          v-for="(route, index) in filteredRoutes"
          :key="index"
          :value="index"
          :to="route.link"
          class="mb-1"
        >
          <v-icon v-if="route.icon" start>
            {{ route.icon }}
          </v-icon>
          {{ route.text }}
          <v-chip
            v-if="route.notifications && route.notifications > 0"
            size="small"
            class="bg-red"
            color="white"
          >
            {{ route.notifications }}
          </v-chip>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block color="error" @click="onLogout">
            <v-icon start> mdi-logout </v-icon>Logout
          </v-btn>
          <div class="py-2 text-center">
            LEMAC
            <v-icon size="x-small"> mdi-copyright </v-icon>
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar density="compact" :order="mdAndDown ? 0 : -1">
      <v-app-bar-nav-icon v-if="mdAndDown" color="primary" @click.stop="drawer = !drawer" />
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

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const { lgAndUp, mdAndDown } = useDisplay();
</script>

<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import { useLoadingStore } from '@/stores/loading.js';
import { getPrintTasks } from '@/api/printingTasks.api.ts';
import { PrintTaskStatus } from '@lemac/data-model/browser';

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
          notifications: 0
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
    ...mapState(useUserStore, ['getId', 'getPermission']),
    ...mapState(useLoadingStore, ['isLoading']),
  },
  watch: {
    group() {
      this.drawer = true;
    },
  },
  mounted() {
    const printingRoute = this.routes.find(route => route.link === '/dashboard/printing');
    if (printingRoute) {
      this.updateNotifications(printingRoute);
      setInterval(this.updateNotifications, 60000, printingRoute);
    }
  },
  methods: {
    async updateNotifications(route: { notifications?: number }) {
      const tasks = (await getPrintTasks()).data;
      const count = tasks.filter(task =>
        task.status !== PrintTaskStatus.DELIVERED &&
        task.status !== PrintTaskStatus.CANCELLED &&
        (task.status === PrintTaskStatus.WAITING || task.assignedId === this.getId)).length;
      if(count != route.notifications) {
        this.$notify({
          type: 'info',
          title: 'Printing Notifications',
          text: `You have ${count} pending print tasks.`,
          mode: 'html'
        });
        route.notifications = count;
      }
      console.log("Updated with " + route.notifications + " printing notifications.");
    },
    onLogout: function () {
      localStorage.removeItem('token');
      this.logoutUser();
      this.$router.push('/');
      window.open('https://fenix.tecnico.ulisboa.pt/logout', '_blank')?.focus();
    },
    ...mapActions(useUserStore, ['loginUser', 'logoutUser'])
  },
};
</script>
