<template>
  <DashboardTable
    title="Hours"
    :headers="headers"
    :items="hours"
    :sort-by="[{ key: 'id', order: 'desc' }]"
    new-button="New Entry"
    :edit-fields="editFields"
    :edit-initialization="editInitialization"
    @edit="editItem"
    @delete="deleteItem"
  >
    <template #[`item.entry`]="{ item }">
      {{
        new Date(item.entry).toLocaleString('pt-PT', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'UTC',
        })
      }}
    </template>
    <template #[`item.exit`]="{ item }">
      {{
        new Date(item.exit).toLocaleString('pt-PT', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'UTC',
        })
      }}
    </template>
    <template #[`item.time`]="{ item }">
      {{ Math.floor(parseInt(item.time) / 60) }}h{{ parseInt(item.time) % 60 || '' }}
    </template>
    <template #[`item.exitNumber`]="{ item }">
      {{ item.exitNumber != null ? item.exitNumber : '-' }}
    </template>
    <template #[`item.soldAmount`]="{ item }">
      {{ item.soldAmount > 0 ? item.soldAmount : '-' }}
    </template>
  </DashboardTable>
</template>

<script>
import { createHours, deleteHours, updateHours, getLastEntry } from '@/api/hours.api';
import { getUsers } from '@/api/user.api';
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { DateTime } from 'luxon';

export default {
  name: 'HourTable',
  components: {
    DashboardTable,
  },
  props: {
    propHours: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            entry: String,
            exit: String,
            time: Number,
            entryNumber: Number,
            exitNumber: Number,
            safeAmount: Number,
            soldAmount: Number,
          },
        ];
      },
    },
  },
  data() {
    return {
      hours: [],
      users: [],
      lastEntry: null,
      headers: [
        { title: 'Monitor', key: 'user', sortable: false },
        { title: 'Entry Hour', key: 'entry', sortable: false },
        { title: 'Exit Hour', key: 'exit', sortable: false },
        { title: 'Total Time', key: 'time', sortable: false },
        { title: 'Entry Ticket', key: 'entryNumber', sortable: false },
        { title: 'Exit Ticket', key: 'exitNumber', sortable: false },
        { title: 'Tickets Sold', key: 'soldAmount', sortable: false },
        { title: 'Money in Safe', key: 'safeAmount', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false },
      ]
    }
  },
  computed: {
    editFields() {
      return [
        [
          { key: "entry", type: "time", label: "Entry Hour", labelIcon: "mdi-clock-time-four-outline", required: true },
          { key: "exit", type: "time", label: "Exit Hour", labelIcon: "mdi-clock-time-four-outline", required: true }
        ],
        [
          { key: "entryNumber", type: "number", label: "Entry Ticket", labelIcon: "mdi-ticket-confirmation-outline", required: true, default: this.lastEntry ? this.lastEntry.exitNumber : undefined },
          { key: "exitNumber", type: "number", label: "Exit Ticket", labelIcon: "mdi-ticket-confirmation-outline", required: true }
        ],
        [
          { key: "safeAmount", type: "number", label: "Money in safe", labelIcon: "mdi-cash", required: true },
        ],
        [
          { key: "entryDate", type: "date", label: "Date for entry (OPTIONAL)", labelIcon: "mdi-calendar" },
        ],
        [
          { key: "userId", type: "autocomplete", label: "User", labelIcon: "mdi-account", default: this.users.find((user) => user.current), props: { items: this.users, "item-title": "name", "item-value": "id" } },
        ]
      ];
    },
    ...mapState(useUserStore, ['getPermission']),
  },
  watch: {
    async hours() {
      this.lastEntry = (await getLastEntry()).data;
    },
  },
  async mounted() {
    this.hours = this.propHours; // TODO: WHY TF
    this.users = (await getUsers()).data;
    this.lastEntry = (await getLastEntry()).data;
  },
  methods: {
    editInitialization(item) {
      return {
        id: item.id,
        userId: item.userId,
        entry: DateTime.fromISO(item.entry).toFormat("HH:mm"),
        exit: DateTime.fromISO(item.exit).toFormat("HH:mm"),
        entryNumber: item.entryNumber,
        exitNumber: item.exitNumber,
        safeAmount: item.safeAmount,
        soldAmount: item.soldAmount,
        entryDate: DateTime.fromISO(item.entry)
      };
    },
    async editItem(item, values) {
      const dateEntry = values.entryDate ? DateTime.fromISO(values.entryDate) : DateTime.now();
      const [hEntry, mEntry] = values.entry.split(':').map(Number);
      values.entry = dateEntry.set({hour: hEntry, minute: mEntry}).toUTC().toISO();
      const [hExit, mExit] = values.exit.split(':').map(Number);
      values.exit = dateEntry.set({hour: hExit, minute: mExit}).toUTC().toISO();

      values.userId = values.userId ?? this.users.find((user) => user.current).id;
      console.log(values)
      if(item) {
        console.log(values)
        const response = await updateHours(item.id, values);

        response.data.soldAmount = (response.data.exitNumber ?? 0) - response.data.entryNumber;
        response.data.user = this.users.find((user) => user.id === response.data.userId).name;

        this.hours.splice(this.hours.indexOf(item), 1, response.data); // Update the entry in the table
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated entry ${response.data.id}`,
        });
      } else {
        const response = await createHours(values);

        response.data.soldAmount = response.data.exitNumber - response.data.entryNumber;
        response.data.user = response.data.user.name;

        this.hours.push(response.data);
        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.data.id}`,
        });
      }
    },

    async deleteItem(item) {
      await deleteHours(item.id);
      const deleted = this.hours.splice(this.hours.indexOf(item), 1);
      this.$notify({
        type: 'success',
        title: 'Entry deleted',
        text: `You have deleted entry ${deleted[0].id}`,
      });
    },
  },
};
</script>
