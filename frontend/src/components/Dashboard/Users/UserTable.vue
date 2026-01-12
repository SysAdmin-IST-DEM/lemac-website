<template>
  <DashboardTable
    title="Users"
    :headers="headers"
    :items="users"
    search
    :sort-by="[{ key: 'name'}]"
  >
    <template #[`item.state`]="{ item }">
      <v-chip
        :color="(states.find(v => v.value === item.state).color)"
        variant="elevated"
      >
        {{ (states.find(v => v.value === item.state)).text }}
      </v-chip>
    </template>
    <template #[`item.lastModified`]="{ item }">
      {{ getTimeDiff(item.lastModified) }}
    </template>
  </DashboardTable>
</template>

<script>

import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';

export default {
  name: 'UserTable',
  components: { DashboardTable },
  props: {
    members: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            name: String,
            istId: String,
            active: Number,
            admin: Number,
          },
        ];
      },
    },
  },
  data: () => ({
    users: [],
    headers: [
      { title: 'User', key: 'name' },
      { title: 'Workstation', key: 'workstation' },
      { title: 'IST Id', key: 'istId' },
      { title: 'Email', key: 'email', filterable: false },
      { title: 'Course', key: 'course' },
      { title: 'State', key: 'state' },
      { title: 'Mifare ID', key: 'mifareId', sortable: false, filterable: false },
      { title: 'Time since last action', key: 'lastModified', sortable: false, filterable: false },
    ],
    states: [
      { text: 'Online', value: "online", color: 'blue' },
      { text: 'Offline', value: "offline", color: 'gray' },
      { text: 'In-Break', value: "in_break", color: 'orange' },
    ],
  }),
  mounted() {
    this.users = this.members;
  },
  methods: {
    getTimeDiff(sqlDateString) {
      // Assuming the SQL date is stored as a string in ISO format, like "2023-05-05T13:48:35.000Z"
      const sqlDate = new Date(sqlDateString);
      const currentDate = new Date();

      // Get the timezone offset difference between the two dates in minutes
      const timezoneOffsetDiff = -currentDate.getTimezoneOffset();

      // Calculate the time difference in milliseconds, adjusted for the timezone offset difference
      const diff = Math.abs(currentDate.getTime() - sqlDate.getTime() + (timezoneOffsetDiff * 60 * 1000));

      // Convert the time difference to hours, minutes, and seconds
      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(1, "0");
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, "0");
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;

    }
  }
};
</script>
