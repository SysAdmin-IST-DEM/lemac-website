<template>
  <v-container class="container">
    <DashboardEditDialog
      ref="editDialog"
      v-model="showEditDialog"
      :item="lastEntry"
      :fields="editFields"
      :on-initialization="onInitialization"
      save-color="success"
      :should-disable-save="true"
      cancel-color="success"
      cancel-text="Skip"
      :cancel-action="() => { $router.push('dashboard') }"
      :on-save-error="() => { $router.push('/') }"
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
import { DateTime } from 'luxon';
export default {
  name: 'LoginPage',
  components: {
    DashboardEditDialog,
  },
  data() {
    return {
      editFields: [
        [
          { key: 'entryHours', type: 'time', label: 'Entry Hours', labelIcon: 'mdi-clock-time-four-outline', required: true },
          { key: 'exitHours', type: 'time', label: 'Exit Hours', labelIcon: 'mdi-clock-time-four-outline', required: true, rules: [
              (v) => {
                if(v > this.$refs.editDialog.values['entryHours']) return true;
                return 'Exit hours must be after entry hours';
              }
            ]
          },
        ],
        [
          { key: 'entryNumber', type: 'number', label: 'Entry Ticket', labelIcon: 'mdi-ticket-confirmation', required: true },
          { key: 'exitNumber', type: 'number', label: 'Exit Ticket', labelIcon: 'mdi-ticket-confirmation', required: false },
        ],
        [
          { key: 'safeAmount', type: 'number', label: 'Money in Safe', labelIcon: 'mdi-safe-square-outline', required: true },
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
      console.log(event);
      return {
        entryNumber: event.exitNumber,
        safeAmount: event.safeAmount
      }
    },
    async saveHours(event, values) {
      const [hEntry, mEntry] = values.entryHours.split(':').map(Number);
      values.entry = DateTime.now().set({hour: hEntry, minute: mEntry, second: 0, millisecond: 0}).toUTC().toISO();
      const [hExit, mExit] = values.exitHours.split(':').map(Number);
      values.exit = DateTime.now().set({hour: hExit, minute: mExit, second: 0, millisecond: 0}).toUTC().toISO();
      delete values.entryHours;
      delete values.exitHours;

      if(!values.exitNumber) values.exitNumber = values.entryNumber;

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
