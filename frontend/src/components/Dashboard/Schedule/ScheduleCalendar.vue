<template>
  <v-row class="fill-height">
    <v-col>
      <LemacCalendar
        ref="calendar"
        :events="events"
        class="bg-white"
        :editable-events="editMode"
        :time-to="1260"
        :snap-to-interval="15"
        :clickable-event="false"
        :disable-days="offDaysDates"
        :start-week-on-sunday="false"
        hide-weekends
        @event-create="createEvent"
        @event-delete="deleteEvent"
        @event-click="showDelete"
        @event-dblclick="false"
      >
        <template #dropdowns>
          <v-switch
            v-model="editMode"
            label="Edit mode"
            color="secondary"
            class="mr-4 mt-5"
            inset
          />

          <v-menu location="bottom right">
            <template #activator="{ props }">
              <v-btn
                color="secondary"
                variant="elevated"
                class="mr-4"
                v-bind="props"
              >
                <span>{{ currentUser ? currentUser.name : 'User' }}</span>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(user, index) in this.users"
                :key="index"
                @click="currentUser = user"
              >
                <v-list-item-title>{{ user.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </LemacCalendar>

      <v-sheet class="flex! flex-row items-center justify-start py-3 gap-3">
        <ScheduleFooter
          :schedule="this"
          :calendar="$refs.calendar"
          :current-user="currentUser"
          @update-off-days="reloadOffDays"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getUsers } from '@/api/user.api.js';
import {
  createHours,
  getHours,
  deleteHours,
  getOffDays,
} from '@/api/schedule.api.js';
import moment from 'moment';
import { mapGetters } from 'vuex';
import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue';
import ScheduleFooter from '@/components/Dashboard/Schedule/ScheduleFooter.vue';

export default {
  components: { ScheduleFooter, LemacCalendar },
  data: () => ({
    editMode: false,
    events: [],
    offDays: [],
    users: [],
    currentUser: null
  }),
  computed: {
    offDaysDates() {
      return this.offDays.map((val) => moment(val.date).format("YYYY-MM-DD"));
    },
    ...mapGetters('user', ['getPermission']),
  },
  async mounted() {
    this.users = (await getUsers()).data;
    const inactiveUsers = this.users.filter((user) => !user.active);
    this.users = this.users.filter((user) => user.active);
    this.currentUser = this.users.find((user) => user.current);

    let events = (await getHours()).data;
    events = events.map((val) => {
      let user = this.users.find((user) => user.id === val.userId);
      if (!user) user = inactiveUsers.find((user) => user.id === val.userId);
      if (user === undefined)
        return {
          id: val.id,
          title: 'Unknown',
          start: moment(val.entry).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
          end: moment(val.exit).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
          details: val
        };

      return {
        id: val.id,
        title: user.name,
        start: moment(val.entry).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
        end: moment(val.exit).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
        backgroundColor: user.color,
        details: val
      };
    });
    this.events = events;

    this.offDays = (await getOffDays()).data;
  },
  methods: {
    showDelete({ e, event }) {
      if(!this.editMode) return;
      if(event.details.userId !== this.currentUser.id) return;
      event.delete(1);
      setTimeout(() => event._.deleting = false, 5000);
    },
    async createEvent({ event, resolve }) {
      const minutesFromMidnight = date =>
        date.getHours() * 60 + date.getMinutes();
      if(minutesFromMidnight(event.start) < 540 || minutesFromMidnight(event.end) > 1200) {
        resolve()
        return
      }

      const response = (await createHours({
        userId: this.currentUser.id,
        entry: moment(event.start).format('YYYY-MM-DDTHH:mm'),
        exit: moment(event.end).format('YYYY-MM-DDTHH:mm')
      })).data
      resolve({
        ...event,
        id: response.id,
        title: this.currentUser.name ?? 'Unknown User',
        backgroundColor: this.currentUser.color,
        details: {
          id: response.id,
          userId: this.currentUser.id
        }
      });
      this.$notify({
        type: 'success',
        title: 'Entry created',
        text: `You have created entry ${response.id}`,
      });
    },
    async deleteEvent(event) {
      await deleteHours(event.id);
      this.$notify({
        type: 'success',
        title: 'Entry deleted',
        text: `You have deleted entry ${event.id}`,
      });
    },
    async reloadOffDays() {
      this.offDays = (await getOffDays()).data;
    }
  },
};
</script>

<style scoped>
::v-deep(.vuecal__cell--sat), ::v-deep(.vuecal__cell--sun) {
  background-color: #f3f3f3 !important;
  pointer-events: none !important;
}
</style>