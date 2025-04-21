<template>
  <LemacDataTable
    ref="table"
    title="Hours"
    :headers="headers"
    :items="hours"
    :sort-by="[{ key: 'id', order: 'desc' }]"
    new-button="Add Entry"
    :edit-fields="editFields"
    :edit-initialization="editInitialization"
    @edit="editItem"
    @delete="deleteItemConfirm"
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
      {{ Math.floor(parseInt(item.time) / 60) }}h{{ parseInt(item.time % 60) || '' }}
    </template>
    <template #[`item.exit_number`]="{ item }">
      {{ item.exit_number != null ? item.exit_number : '-' }}
    </template>
    <template #[`item.sold_amount`]="{ item }">
      {{ item.sold_amount > 0 ? item.sold_amount : '-' }}
    </template>
  </LemacDataTable>
</template>

<script>
import { createHours, deleteHours, updateHours, getLastEntry } from '@/api/hours.api';
import { getUsers } from '@/api/user.api';
import { mapGetters } from 'vuex';
import moment from 'moment';
import LemacDataTable from '@/components/LemacDataTable/LemacTable.vue';

export default {
  name: 'HourTable',
  components: {
    LemacDataTable,
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
            entry_number: Number,
            exit_number: Number,
            safe_amount: Number,
            sold_amount: Number,
          },
        ];
      },
    },
  },
  data: () => ({
    hours: [],
    users: [],
    lastEntry : null,
    headers: [
      { title: 'Monitor', key: 'user', sortable: false },
      { title: 'Entry Hour', key: 'entry', sortable: false },
      { title: 'Exit Hour', key: 'exit', sortable: false },
      { title: 'Total Time', key: 'time', sortable: false },
      { title: 'Entry Ticket', key: 'entry_number', sortable: false },
      { title: 'Exit Ticket', key: 'exit_number', sortable: false },
      { title: 'Tickets Sold', key: 'sold_amount', sortable: false },
      { title: 'Money in Safe', key: 'safe_amount', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ]
  }),
  computed: {
    editFields() {
      return [
        [
          { key: "entry", type: "time", label: "Entry Hour", labelIcon: "mdi-clock-time-four-outline", required: true },
          { key: "exit", type: "time", label: "Exit Hour", labelIcon: "mdi-clock-time-four-outline", required: true }
        ],
        [
          { key: "entry_number", label: "Entry Ticket", labelIcon: "mdi-ticket-confirmation-outline", required: true, default: this.lastEntry ? this.lastEntry.exit_number : undefined },
          { key: "exit_number", label: "Exit Ticket", labelIcon: "mdi-ticket-confirmation-outline", required: true }
        ],
        [
          { key: "safe_amount", label: "Money in safe", labelIcon: "mdi-cash", required: true },
        ],
        [
          { key: "entry_date", type: "date", label: "Date for entry (OPTIONAL)", labelIcon: "mdi-calendar" },
        ],
        [
          { key: "userId", type: "autocomplete", label: "User", labelIcon: "mdi-account", default: this.users.find((user) => user.current), props: { items: this.users, "item-title": "name", "item-value": "id" } },
        ]
      ];
    },
    ...mapGetters('user', ['getPermission']),
  },
  watch: {
    async hours() {
      this.lastEntry = (await getLastEntry()).data;
    },
  },
  async mounted() {
    this.hours = this.getPermission === 1 ? this.propHours : []; // TODO: WHY TF
    this.users = (await getUsers()).data;
    this.lastEntry = (await getLastEntry()).data;
  },
  methods: {
    editInitialization(item) {
      return {
        id: item.id,
        userId: item.userId,
        entry: new Date(item.entry).toLocaleTimeString(undefined, {
          timeStyle: 'short',
          timeZone: 'UTC',
          hourCycle: 'h23',
        }),
        exit: new Date(item.exit).toLocaleTimeString(undefined, {
          timeStyle: 'short',
          timeZone: 'UTC',
          hourCycle: 'h23',
        }),
        entry_number: item.entry_number,
        exit_number: item.exit_number,
        safe_amount: item.safe_amount,
        sold_amount: item.sold_amount,
        entry_date: new Date(item.entry)
      };
    },
    async editItem(item, values) {
      values.entry = moment(values.entry_date ?? new Date()).format('YYYY-MM-DD') + 'T' + values.entry + ':000Z';
      values.exit = moment(values.entry_date ?? new Date()).format('YYYY-MM-DD') + 'T' + values.exit + ':000Z';
      values.userId = values.userId ?? this.users.find((user) => user.current).id;
      if(item) {
        const response = await updateHours(item.id, values);

        response.data.sold_amount = (response.data.exit_number ?? 0) - response.data.entry_number;
        response.data.user = this.users.find((user) => user.id === response.data.userId).name;

        this.hours.splice(this.hours.indexOf(item), 1, response.data); // Update the entry in the table
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated entry ${response.data.id}`,
        });
      } else {
        const response = await createHours(values);

        response.data.sold_amount = response.data.exit_number - response.data.entry_number;
        response.data.user = this.users.find((user) => user.id == response.data.userId).name;
        console.log(JSON.stringify(response.data));

        this.hours.push(response.data);
        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.data.id}`,
        });
      }
    },

    async deleteItemConfirm(item) {
      this.editedIndex = this.hours.indexOf(item);
      await deleteHours(this.hours[this.editedIndex].id);
      const deleted = this.hours.splice(this.editedIndex, 1);
      this.$notify({
        type: 'success',
        title: 'Entry deleted',
        text: `You have deleted entry ${deleted[0].id}`,
      });
    },
  },
};
</script>
