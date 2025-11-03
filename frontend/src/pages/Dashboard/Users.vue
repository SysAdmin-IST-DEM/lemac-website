<template>
  <v-tabs
    v-model="tab"
    color="primary"
    bg-color="white"
    slider-color="primary"
    grow
  >
    <v-tab value="1">
      Monitors
    </v-tab>
    <v-tab value="2">
      Users
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <v-container
        v-if="monitors"
        class="mt-6"
      >
        <MonitorTable :members="monitors" />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <v-container>
        <UserTable :members="users" />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import MonitorTable from '@/components/Dashboard/Users/MonitorTable.vue';
import UserTable from '@/components/Dashboard/Users/UserTable.vue';
import { getUsers } from '@/api/user.api.js';
import { getLemacUsers } from '@/api/lemacUsers.api.js';
import { getEntries } from '@/api/entries.api.js';

export default {
  name: 'UserPage',
  components: { MonitorTable, UserTable },
  data: () => ({
    tab: null,
    monitors: null,
    users: null,
  }),
  async mounted() {
    this.$loading.show();
    this.monitors = (await getUsers()).data;
    this.users = (await getLemacUsers()).data;
    const entries = (await getEntries()).data;

    this.users.forEach((val) => {
      const entrie = entries.find((item) => 'ist1' + val.ist_id === item.istId && item.active);

      if (entrie) {
        val.workstation = entrie.workstation.name;
      } else {
        val.workstation = 'ERROR';
      }
    });
    this.$loading.hide();
  },
};
</script>
