<template>
  <v-row class="fill-height">
    <v-col>
      <RoomCalendar
        ref="calendar"
        class="bg-white"
      >
        <template #extra-dropdowns>
          <v-btn
            color="secondary"
            variant="elevated"
            class="mr-4"
            @click="
              selectedEvent = null;
              editEventDialog = true;
            "
          >
            Add Event
          </v-btn>

          <DashboardEditDialog
            v-model="editEventDialog"
            :item="selectedEvent"
            :fields="fields"
            :on-initialization="editInitialization"
            @edit="editEvent"
          >
            <template #title> Event </template>
          </DashboardEditDialog>
        </template>

        <template #extra-event-details="{ event }">
          <span v-if="typeof event.details.id === 'number'">
            <b>Observations:</b>
            <span v-for="e in event.details.events" :key="e.id">
              <span v-if="e.observations" style="margin-bottom: 0">
                {{ e.observations }}
              </span>
            </span>
          </span>
          <p v-else>Description: {{ event.details.description }}</p>
        </template>

        <template #extra-event-details-actions="{ event }">
          <v-btn
            color="primary"
            @click="
              selectedEvent = event;
              editEventDialog = true;
            "
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-spacer />

          <v-btn color="primary" @click="giveKey(event)">
            {{ !event.givenKey ? 'Give key' : 'Receive key' }}
          </v-btn>
          <v-btn color="primary" variant="text" @click="deleteEvent(event.details)">
            Delete
          </v-btn>
        </template>
      </RoomCalendar>
    </v-col>
  </v-row>
</template>

<script>
import {
  getHoursFenix,
  getHours,
  createHours,
  deleteHours,
  updateHours,
} from '@/api/room_hours.api.js';
import { createEvent, getEvents } from '@/api/room_events.api.js';
import moment from 'moment';
import RoomCalendar from '@/components/RoomCalendar.vue';
import DashboardEditDialog from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';

export default {
  components: { DashboardEditDialog, RoomCalendar },
  data: () => ({
    selectedEvent: null,
    editEventDialog: false,
    fields: [
      [
        { key: "date", type: "date", label: "Date for reservation", labelIcon: "mdi-calendar", required: true}
      ],
      [
        { key: "entry", type: "time", label: "Entry Hour", labelIcon: "mdi-clock-time-four-outline", required: true },
        { key: "exit", type: "time", label: "Exit Hour", labelIcon: "mdi-clock-time-four-outline", required: true }
      ],
      [
        { key: "name", label: "Name for reservation", required: true},
        { key: "ist_id", label: "Ist ID (ist*)", required: true},
      ],
      [
        { key: "room", type: "select", label: "Room for reservation", labelIcon: "mdi-home-outline", required: true, props: { items: ['SDM', 'MOM', 'LTI'] } }
      ]
    ]
  }),
  methods: {
    editInitialization(event) {
      return {
        entry: moment(event.start).format("HH:mm"),
        exit: moment(event.end).format("HH:mm"),
        date: moment(event.start).format("YYYY-MM-DD"),
        ist_id: event.details.user.id,
        name: event.details.user.name,
        room: event.details.room
      };
    },
    async editEvent(event, values) {
      values.entry = moment(values.date).format('YYYY-MM-DD') + 'T' + values.entry;
      values.exit = moment(values.date).format('YYYY-MM-DD') + 'T' + values.exit;
      values.reservation_id = values.ist_id;

      if (event) {
        values.givenKey = event.givenKey;
        const response = await updateHours(event.details.id, values);
        await createEvent({
          type: 'res_updated',
          roomDataId: response.data.id,
        });

        event.title = `Reservation of ${response.data.user.name}`;
        event.start = moment(response.data.entry).utcOffset("+0000").format("YYYY-MM-DD HH:mm");
        event.end = moment(response.data.exit).utcOffset("+0000").format("YYYY-MM-DD HH:mm");
        event.customColor = this.$refs.calendar.colors[response.data.room] + (event.givenKey ? ' darken-4' : '');
        event.class = "bg-" + this.$refs.calendar.colors[response.data.room] + (event.givenKey ? '-darken-4' : '');
        event.details = response.data
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated entry ${response.data.id}`,
        });
      } else {
        const response = await createHours(values);
        await createEvent({
          type: 'res_created',
          roomDataId: response.data.id,
        });

        const event = response.data;
        event.title = `Reservation of ${event.user.name}`;
        this.$refs.calendar.events.push({
          id: event.id,
          title: event.title,
          start: moment(event.entry).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
          end: moment(event.exit).utcOffset("+0000").format("YYYY-MM-DD HH:mm"),
          customColor: this.$refs.calendar.colors[event.room],
          class: 'bg-' + this.$refs.calendar.colors[event.room],
          givenKey: false,
          details: event,
        });
        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.data.id}`,
        });
      }
    },
    async giveKey(event) {
      const values = {
        entry: event.details.entry,
        exit: event.details.exit,
        reservation_id: event.details.user.id,
        room: event.details.room,
        name: event.details.user.name,
        givenKey: !event.givenKey,
      }

      event.givenKey = !event.givenKey;
      event.customColor = this.$refs.calendar.colors[event.details.room] + (event.givenKey ? ' darken-4' : '');
      event.class = "bg-" + this.$refs.calendar.colors[event.details.room] + (event.givenKey ? '-darken-4' : '');
      this.$refs.calendar.$refs.lemacCalendar.closeEvent();

      const response = await updateHours(event.details.id, values);
      await createEvent({
        type: event.givenKey ? 'key_received' : 'key_given',
        roomDataId: response.data.id,
      });

      this.$notify({
        type: 'success',
        title: 'Key was given/received',
        text: `You have sucessfully given/received the key`,
      });
    },
    async deleteEvent(event) {
      await deleteHours(event.id);
      this.$refs.calendar.events = this.$refs.calendar.events.filter((val) => val.id !== event.id);
      this.$refs.calendar.$refs.lemacCalendar.closeEvent();

      await createEvent({
        type: 'res_deleted',
        roomDataId: event.id,
      });

      this.$notify({
        type: 'success',
        title: 'Entry deleted',
        text: `You have deleted entry ${event.id}`,
      });
    }
  },
};
</script>

<style scoped>
::v-deep(.vuecal--default-theme) {
  --vuecal-height: 600px !important;
}
</style>