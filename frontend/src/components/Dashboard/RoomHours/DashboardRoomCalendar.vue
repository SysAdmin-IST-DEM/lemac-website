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
import RoomCalendar from '@/components/RoomCalendar.vue';
import DashboardEditDialog from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
import { DateTime } from 'luxon';

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
        { key: "istId", label: "Ist ID (ist*)", required: true},
      ],
      [
        { key: "room", type: "select", label: "Room for reservation", labelIcon: "mdi-home-outline", required: true, props: { items: ['SDM', 'MOM', 'LTI'] } }
      ]
    ]
  }),
  methods: {
    editInitialization(event) {
      return {
        entry: DateTime.fromJSDate(event.start).toFormat("HH:mm"),
        exit: DateTime.fromJSDate(event.end).toFormat("HH:mm"),
        date: DateTime.fromJSDate(event.start).toFormat("yyyy-MM-dd"),
        istId: event.details.istId,
        name: event.details.name,
        room: event.details.room
      };
    },
    async editEvent(event, values) {
      console.log(typeof values.date)
      values.entry = DateTime.fromISO(values.date).toFormat('yyyy-MM-dd') + 'T' + values.entry;
      values.exit = DateTime.fromISO(values.date).toFormat('yyyy-MM-dd') + 'T' + values.exit;

      if (event) {
        values.givenKey = event.givenKey;
        const response = await updateHours(event.details.id, values);
        await createEvent({
          type: 'res_updated',
          roomReservationId: response.data.id,
        });

        event.title = `Reservation of ${response.data.name}`;
        event.start = DateTime.fromISO(response.data.entry).toUTC().toFormat("yyyy-MM-dd HH:mm");
        event.end = DateTime.fromISO(response.data.exit).toUTC().toFormat("yyyy-MM-dd HH:mm");
        event.customColor = this.$refs.calendar.colors[response.data.room] + (event.givenKey ? ' darken-4' : '');
        event.class = "bg-" + this.$refs.calendar.colors[response.data.room] + (event.givenKey ? '-darken-4' : '');
        event.details = response.data
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated entry ${response.data.id}`,
        });
      } else {
        console.log(values)
        const response = await createHours(values);
        await createEvent({
          type: 'res_created',
          roomReservationId: response.data.id,
        });

        const event = response.data;
        event.title = `Reservation of ${event.name}`;
        this.$refs.calendar.events.push({
          id: event.id,
          title: event.title,
          start: DateTime.fromISO(event.entry).toUTC().toFormat("yyyy-MM-dd HH:mm"),
          end: DateTime.fromISO(event.exit).toUTC().toFormat("yyyy-MM-dd HH:mm"),
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
      console.log(event.details.istId, typeof event.details.istId)
      const values = {
        entry: event.details.entry,
        exit: event.details.exit,
        istId: event.details.istId,
        room: event.details.room,
        name: event.details.user.name,
        givenKey: !event.givenKey,
      }
      console.log(values);

      event.givenKey = !event.givenKey;
      event.customColor = this.$refs.calendar.colors[event.details.room] + (event.givenKey ? ' darken-4' : '');
      event.class = "bg-" + this.$refs.calendar.colors[event.details.room] + (event.givenKey ? '-darken-4' : '');
      this.$refs.calendar.$refs.lemacCalendar.closeEvent();

      const response = await updateHours(event.details.id, values);
      await createEvent({
        type: event.givenKey ? 'key_received' : 'key_given',
        roomReservationId: response.data.id,
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
        roomReservationId: event.id,
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