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
  </v-tabs-window>
</template>

<script>
import MonitorTable from '@/components/Dashboard/Users/MonitorTable.vue';
import { getUsers } from '@/api/user.api.js';

export default {
  name: 'UserPage',
  components: { MonitorTable },
  data: () => ({
    tab: null,
    monitors: null,
  }),
  async mounted() {
    this.$loading.show();
    this.monitors = (await getUsers()).data;

    this.$loading.hide();
  },
};
</script>
