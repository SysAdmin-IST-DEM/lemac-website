<template>
  <div v-if="getPermission === 1">
    <v-tabs
      v-model="tab"
      color="primary"
      bg-color="white"
      slider-color="primary"
      grow
    >
      <v-tab value="1">
        Personal Hours
      </v-tab>
      <v-tab value="2">
        Calendar
      </v-tab>
      <v-tab value="3">
        Hour Table
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1">
        <v-container v-if="hours">
          <HourTable :prop-hours="hours" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="2">
        <v-container>
          <HoursCalendar />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="3">
        <v-container>
          <SumTable />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <div v-else>
    <v-container
      v-if="hours"
      class="mt-6"
    >
      <HourTable :prop-hours="hours" />
    </v-container>
  </div>
</template>

<script>
import HourTable from '@/components/Dashboard/Hours/HoursTable.vue';
import HoursCalendar from '@/components/Dashboard/Hours/HoursCalendar.vue';
import SumTable from '@/components/Dashboard/Hours/SumTable.vue';
import { getHoursSelf, getHours } from '@/api/hours.api';
import { mapGetters } from 'vuex';
import { getUsers } from '@/api/user.api';

export default {
  name: 'Hours',
  components: { HourTable, HoursCalendar, SumTable },
  data() {
    return {
      tab: null,
      hours: null,
    };
  },
  computed: {
    ...mapGetters('user', ['getPermission']),
  },
  async mounted() {
    this.$loading.show();
    const users = (await getUsers()).data;
    const response = this.getPermission === 1 ? await getHours(-1, -1) : await getHoursSelf();

    const data = response.data.map((val) => {
      val.sold_amount = val.exit_number - val.entry_number;
      val.user = users.find(user => user.id == val.userId).name;

      return val;
    });

    this.hours = data;
    this.$loading.hide();
  },
};
</script>

<style></style>
