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
              { title: 'Start', key: 'date_start' },
              { title: 'End', key: 'date_end' },
              { title: 'Target Hours', key: 'target_hours' },
              { title: '', key: 'buttons' },
            ]"
            :items="userTargets"
            hide-header
            hide-default-footer
            :items-per-page="5"
            :sort-by="[{ key: 'date_start', order: 'desc'}]"
            sort
            :page="targetsPage"
            :edit-initialization="editTargetsInitialization"
            :edit-fields="editTargetsFields"
            @edit="editTargetsSubmit"
          >
            <template #[`item.date_start`]="{ item }">
              {{ $moment(item.date_start).format('DD/MM/YYYY') }}
            </template>

            <template #[`item.date_end`]="{ item }">
              {{ $moment(item.date_end).format('DD/MM/YYYY') }}
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
  getOffDays,
  getUserTargets,
  setOffDays,
  setUserTarget,
} from '@/api/schedule.api.js';
import moment from 'moment';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { mapGetters } from 'vuex';

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
        { key: 'target_hours', label: 'Target Hours', labelIcon: 'mdi-clock', type: 'number', required: true, props: { min: 0 } },
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
    ...mapGetters('user', ['getPermission']),
  },
  watch: {
    async currentUser(user) {
      this.userTargets = (await getUserTargets()).data.filter((val) => val.userId === user.id);
    },
    offDays(newValue) {
      this.datesOffDays = newValue.map((val) => moment(val.date).toDate());
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
      const currentDate = moment(this.calendar.getVueCal().view.start).add(2, 'days').toDate();
      return this.userTargets.find((val) => {
        if (!this.calendar) return false;
        return currentDate >= new Date(val.date_start) && currentDate <= new Date(val.date_end);
      });
    },
    getTargetHours() {
      const currentTarget = this.getCurrentTarget();
      return currentTarget ? currentTarget.target_hours : '...';
    },
    getWorkingHours() {
      const currentTarget = this.getCurrentTarget();

      if (!currentTarget) return '...';

      const currentEvents = this.calendar.events.filter((event) => {
        const test1 = event.details.userId === this.currentUser.id;
        const test2 =
          new Date(event.start) >= new Date(currentTarget.date_start) &&
          new Date(event.end) <= new Date(currentTarget.date_end);

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
      const currentDate = new Date(item.date_start);
      const dateEnd = new Date(item.date_end)

      while (currentDate <= dateEnd) {
        dates.push(moment(currentDate).format('YYYY-MM-DD'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log(dates);

      return {
        dates,
        target_hours: item.target_hours
      }
    },
    async editTargetsSubmit(item, values) {
      values = {
        date_start: moment(values.dates[0]).format('YYYY-MM-DD'),
        date_end: moment(values.dates[values.dates.length - 1]).format('YYYY-MM-DD'),
        targetHours: values.target_hours,
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
      const dates = this.datesOffDays.map((date) => moment(date).format('YYYY-MM-DD'));
      const addedDates = dates.filter((item) => !this.schedule.offDaysDates.includes(item));
      const removedDates = this.schedule.offDaysDates.filter((item) => !dates.includes(item));

      for (const date of addedDates) {
        await setOffDays({ date });
      }

      for (const date of removedDates) {
        await deleteOffDay(
          this.schedule.offDays.find((val) => moment(val.date).format('YYYY-MM-DD') === date).id
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