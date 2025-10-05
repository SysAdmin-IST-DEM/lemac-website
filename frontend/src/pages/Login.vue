<template>
  <v-container class="container">
    <DashboardEditDialog
      ref="editDialog"
      v-model="showEditDialog"
      :item="lastEntry"
      :fields="editFields"
      :on-initialization="onInitialization"
      save-color="success"
      :should-disable-cancel="true"
      cancel-color="success"
      cancel-text="Skip"
      :cancel-action="() => { $router.push('dashboard') }"
      :handle-save-error="() => { $router.push('/') }"
      @edit="saveHours"
    >
      <template #prepend-title>
        <span
          style="display: none"
          aria-hidden="true"
        />
      </template>
      <template #title>
        Hour Register
      </template>
      <template #subtitle>
        Please log your work hours for today, or press the skip button if you are not working in
        the lab today.
      </template>
    </DashboardEditDialog>
  </v-container>
</template>

<script>
import { createHours, getLastEntry } from '@/api/hours.api';
import DashboardEditDialog from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
export default {
  name: 'LoginPage',
  components: {
    DashboardEditDialog,
  },
  data() {
    return {
      editFields: [
        [
          { key: 'entry_hours', type: 'time', label: 'Entry Hours', labelIcon: 'mdi-clock-time-four-outline', required: true },
          { key: 'exit_hours', type: 'time', label: 'Exit Hours', labelIcon: 'mdi-clock-time-four-outline', required: true, rules: [
              (v) => {
                if(v > this.$refs.editDialog.values['entry_hours']) return true;
                return 'Exit hours must be after entry hours';
              }
            ]
          },
        ],
        [
          { key: 'entry_number', type: 'number', label: 'Entry Ticket', labelIcon: 'mdi-ticket-confirmation' },
          { key: 'exit_number', type: 'number', label: 'Exit Ticket', labelIcon: 'mdi-ticket-confirmation' },
        ],
        [
          { key: 'safe_amount', type: 'number', label: 'Money in Safe', labelIcon: 'mdi-safe-square-outline' },
        ],
      ],
      showEditDialog: false,
      lastEntry: null
    };
  },
  async mounted() {
    this.lastEntry = (await getLastEntry()).data;
    this.showEditDialog = true;
  },
  methods: {
    onInitialization(event) {
      return {
        entry_number: event.exit_number,
        safe_amount: event.safe_amount
      }
    },
    async saveHours(event, values) {
      const now = new Date().toJSON();
      values.entry = now.slice(0, 11) + values.entry_hours + ':000Z';
      values.exit = now.slice(0, 11) + values.exit_hours + ':000Z';
      delete values.entry_hours;
      delete values.exit_hours;

      if(!values.exit_number) values.exit_number = values.entry_number;

      await createHours(values);
      this.$notify({
        type: 'success',
        title: 'Hours saved',
        text: `You have sucessfully saved your work hours for today`,
      });
      this.$router.push('/dashboard');
    },
  },
};
</script>
