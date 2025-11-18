<template>
  <v-btn
    color="secondary"
    class="ml-3"
    @click="downloadSchedule"
  >
    Download
  </v-btn>

  <v-btn
    v-if="getPermission === 1"
    color="secondary"
    @click="targetsDialog = true"
  >
    Targets
  </v-btn>

  <v-btn
    v-if="getPermission === 1"
    color="secondary"
    @click="offDaysDialog = true"
  >
    Edit Off Days
  </v-btn>

  <span class="inline-block grow text-center">
    <span style="text-align: center; margin: auto">{{
      currentUser ? currentUser.name : 'Unknown'
    }}</span
    ><br />
    <span style="text-align: center; margin: auto">
      Target: {{ getTargetHours() }} - Current: {{ getWorkingHours() }}
    </span>
  </span>

  <!-- Dialogs -->
  <v-dialog v-model="targetsDialog" max-width="500">
    <v-card width="500">
      <v-form>
        <v-card-title> {{ currentUser ? currentUser.name : 'Unknown' }} </v-card-title>
        <v-card-text class="divide-y">
          <DashboardTable
            ref="targetsTable"
            :headers="[
              { title: 'Start', key: 'dateStart' },
              { title: 'End', key: 'dateEnd' },
              { title: 'Target Hours', key: 'targetHours' },
              { title: '', key: 'buttons' },
            ]"
            :items="userTargets"
            hide-header
            hide-default-footer
            :items-per-page="5"
            :sort-by="[{ key: 'dateStart', order: 'desc'}]"
            sort
            :page="targetsPage"
            :edit-initialization="editTargetsInitialization"
            :edit-fields="editTargetsFields"
            @edit="editTargetsSubmit"
          >
            <template #[`item.dateStart`]="{ item }">
              {{ DateTime.fromISO(item.dateStart).toFormat('dd/MM/yyyy') }}
            </template>

            <template #[`item.dateEnd`]="{ item }">
              {{ DateTime.fromISO(item.dateEnd).toFormat('dd/MM/yyyy') }}
            </template>

            <template #[`item.buttons`]="{ item }">
              <v-btn
                color="secondary"
                @click="$refs.targetsTable.openEditDialog(item)"
              >
                  <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </DashboardTable>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            variant="elevated"
            @click="$refs.targetsTable.openEditDialog(null)"
          >
            Add Target
          </v-btn>

          <div class="flex col-span-2 col-start-4 gap-2 ml-auto">
            <v-btn
              color="secondary"
              variant="elevated"
              @click="targetsPage = Math.max(1, targetsPage - 1)"
            >
              {{ '<' }}
            </v-btn>
            <v-btn
              color="secondary"
              variant="elevated"
              @click="targetsPage = Math.min(targetsPageCount, targetsPage + 1)"
            >
              {{ '>' }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="offDaysDialog" max-width="328px">
    <v-date-picker
      v-model="datesOffDays"
      color="secondary"
      multiple
      show-adjacent-months
      hide-header
      :month="new Date().getMonth()"
      :year="new Date().getFullYear()"
      :disabled="offDaysDisabled"
      @update:model-value="updateOffDays"
    />
  </v-dialog>
</template>

<script>
import {
  deleteOffDay,
  editUserTarget,
  getUserTargets,
  setOffDays,
  setUserTarget,
} from '@/api/schedule.api';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import { DateTime } from 'luxon';

export default {
  name: 'ScheduleFooter',
  components: { DashboardTable },
  props: {
    schedule: {
      type: Object,
      required: true,
    },
    calendar: {
      type: Object,
      default: null,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  emits: ['update-off-days'],
  data: () => ({
    targetsDialog: false,
    offDaysDialog: false,
    userTargets: [],
    datesOffDays: [],
    offDaysDisabled: false,
    targetsPage: 1,
    editTargetsFields: [
      [
        { key: 'dates', label: 'Date Range', labelIcon: 'mdi-calendar', type: 'date', required: true, props: { multiple: 'range' } },
      ],
      [
        { key: 'targetHours', label: 'Target Hours', labelIcon: 'mdi-clock', type: 'number', required: true, props: { min: 0 } },
      ],
    ],
  }),
  computed: {
    offDays() {
      return this.schedule.offDays || [];
    },
    targetsPageCount() {
      return Math.max(1, Math.ceil(this.userTargets.length / 5));
    },
    ...mapState(useUserStore, ['getPermission']),
  },
  watch: {
    async currentUser(user) {
      this.userTargets = (await getUserTargets()).data.filter((val) => val.userId === user.id);
    },
    offDays(newValue) {
      this.datesOffDays = newValue.map((val) => DateTime.fromISO(val.date));
    },
    targetsPageCount() {
      this.targetsPage = 1;
    }
  },
  methods: {
    downloadSchedule() {
      console.log('Download schedule for:', this.currentUser);
    },
    getCurrentTarget() {
      if (!this.calendar) return null;
      const currentDate = DateTime.fromJSDate(this.calendar.getVueCal().view.start).plus({ days: 2 }).toJSDate();
      return this.userTargets.find((val) => {
        if (!this.calendar) return false;
        return currentDate >= new Date(val.dateStart) && currentDate <= new Date(val.dateEnd);
      });
    },
    getTargetHours() {
      const currentTarget = this.getCurrentTarget();
      return currentTarget ? currentTarget.targetHours : '...';
    },
    getWorkingHours() {
      const currentTarget = this.getCurrentTarget();

      if (!currentTarget) return '...';

      const currentEvents = this.calendar.events.filter((event) => {
        const test1 = event.details.userId === this.currentUser.id;
        const test2 =
          new Date(event.start) >= new Date(currentTarget.dateStart) &&
          new Date(event.end) <= new Date(currentTarget.dateEnd);

        return test1 && test2;
      });

      return currentEvents.reduce((accumulator, event) => {
        const startTime = new Date(event.start).getTime(); // Get start time in milliseconds
        const endTime = new Date(event.end).getTime(); // Get end time in milliseconds

        const eventDuration = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        return accumulator + eventDuration;
      }, 0);
    },
    editTargetsInitialization(item) {
      const dates = [];
      const currentDate = new Date(item.dateStart);
      const dateEnd = new Date(item.dateEnd)

      while (currentDate <= dateEnd) {
        dates.push(DateTime.fromJSDate(currentDate).toFormat('yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log(dates);

      return {
        dates,
        targetHours: item.targetHours
      }
    },
    async editTargetsSubmit(item, values) {
      values = {
        dateStart: values.dates[0].toFormat('yyyy-MM-dd'),
        dateEnd: values.dates[values.dates.length - 1].toFormat('yyyy-MM-dd'),
        targetHours: values.targetHours,
      }

      if(item) {
        const response = await editUserTarget(item.id, values);

        console.log("HM " + item.id)
        console.log(values);
        this.userTargets.splice(this.userTargets.indexOf(item), 1, response.data);
        console.log(response.data)
        this.$notify({
          type: 'success',
          title: 'Announcement updated',
          text: `You have updated targets for selected user`,
        });
      } else {
        values.userId = this.currentUser.id;
        const response = await setUserTarget(values);

        this.userTargets.push(response.data);
        this.$notify({
          type: 'success',
          title: 'Announcement updated',
          text: `You have set targets for selected user`,
        });
      }
    },
    async updateOffDays() {
      this.offDaysDisabled = true;
      const dates = this.datesOffDays.map((date) => date.toFormat('yyyy-MM-dd'));
      const addedDates = dates.filter((item) => !this.schedule.offDaysDates.includes(item));
      const removedDates = this.schedule.offDaysDates.filter((item) => !dates.includes(item));

      for (const date of addedDates) {
        await setOffDays({ date });
      }

      for (const date of removedDates) {
        await deleteOffDay(
          this.schedule.offDays.find((val) => DateTime.fromISO(val.date).toFormat('yyyy-MM-dd') === date).id
        );
      }

      this.$notify({
        type: 'success',
        title: 'Entry updated',
        text: `You have updated entries for offdays`,
      });
      this.$emit('update-off-days');
      this.offDaysDisabled = false;
    },
  },
};
</script>