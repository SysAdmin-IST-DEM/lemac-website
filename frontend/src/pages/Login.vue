<template>
  <v-container class="container">
    <DashboardEditDialog
      ref="editDialog"
      v-model="showEditDialog"
      :item="defaultEntry"
      :fields="editFields"
      :on-initialization="onInitialization"
      save-color="success"
      :should-disable-save="true"
      cancel-color="success"
      cancel-text="Skip"
      :cancel-action="() => { confirmationDialog = true }"
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

  <v-dialog
    v-model="confirmationDialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        Are you sure?
      </v-card-title>

      <v-card-text>
        Entry hours and exit hours fields are automatically filled, if you are working just hit Save.
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="#A9A9A9"
          @click="$router.push('dashboard')"
        >
          Skip
        </v-btn>
        <v-btn
          color="success"
          @click="confirmationDialog = false"
        >
          Return
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createHours, getLastEntry } from '@/api/hours.api';
import DashboardEditDialog from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
import { DateTime } from 'luxon';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user.ts';
import { getClosestEvent } from '@/api/schedule.api.ts';
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
      confirmationDialog: false,
      defaultEntry: null
    };
  },
  computed: {
    ...mapState(useUserStore, ['getId']),
  },
  async mounted() {
    const lastEntry = (await getLastEntry()).data;

    if(lastEntry.userId === this.getId && DateTime.now().toMillis() >= DateTime.fromISO(lastEntry.entry).toMillis()) {
      await this.$router.push('/dashboard');
      return;
    }

    const defaultEntry =  {
      entryNumber: lastEntry.exitNumber,
      safeAmount: lastEntry.safeAmount
    }

    const closestHour = (await getClosestEvent(this.getId)).data;
    if (closestHour) {
      defaultEntry.entryHours = DateTime.fromISO(closestHour.entry).toFormat('HH:mm');
      defaultEntry.exitHours = DateTime.fromISO(closestHour.exit).toFormat('HH:mm');
    }

    this.defaultEntry = defaultEntry;
    this.showEditDialog = true;
  },
  methods: {
    onInitialization(event) {
      return {
        entryHours: event.entryHours,
        exitHours: event.exitHours,
        entryNumber: event.entryNumber,
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