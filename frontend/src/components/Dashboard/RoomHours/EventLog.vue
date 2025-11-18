<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :sort-by="[{ key: 'id'}]"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Event List</v-toolbar-title>
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="450px"
        >
          <template #activator="{ props }">
            <v-btn
              color="secondary"
              theme="dark"
              class="mb-2"
              v-bind="props"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <v-date-picker
            v-model="dates"
            class="py-3"
            multiple="range"
            full-width
            no-title
            @change="update()"
          />
        </v-dialog>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                variant="text"
                @click="closeDelete"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                @click="deleteItemConfirm"
              >
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogObs"
          max-width="500px"
        >
          <v-card>
            <v-form
              ref="formEdit"
              @submit.prevent="save"
            >
              <v-card-title> Add observation </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="editedItem.observations"
                  variant="filled"
                  clearable
                  counter
                  auto-grow
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  variant="text"
                  @click="cancel()"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="addObservation(editedItem)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon
        size="small"
        class="mr-2"
        @click="openObservation(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { getEvents, deleteEvent, updateEvent } from '@/api/room_events.api';
import { getUsers } from '@/api/user.api';
import { DateTime } from 'luxon';
export default {
  name: 'EventLog',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogObs: false,
    data: [],
    editedIndex: 0,
    editedItem: {},
    dates: [],
    headers: [
      { title: 'Type', value: 'type' },
      { title: 'Reservation id', value: 'res' },
      { title: 'User', value: 'user' },
      { title: 'Created At', value: 'time' },
      { title: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  async mounted() {
    this.$loading.show();
    const now = DateTime.now();
    const start = now.minus({ days: now.weekday }).startOf('day');
    for(let i = 0; i < 7; i++) {
      this.dates.push(start.plus({ days: i }));
    }
    const data_response = (await getEvents(this.dates[0], this.dates[this.dates.length - 1])).data;
    const users = (await getUsers()).data;

    for (const value of data_response) {
      const user = users.find((val) => val.id === value.userId);
      this.data = [
        ...this.data,
        {
          type: `${this.getReservationText(value.type)}`,
          ogType: value.type,
          res: value.roomReservationId,
          user: user.name,
          id: value.id,
          time: new Date(value.createdAt).toLocaleString(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'UTC',
          }),
          observations: value.observations,
        },
      ];
    }

    this.$loading.hide();
  },
  methods: {
    async update() {
      this.$loading.show();
      this.data = [];

      if (this.dates[0] > this.dates[this.dates.length - 1]) this.dates.reverse();

      const data_response = (await getEvents(this.dates[0], this.dates[this.dates.length - 1])).data;
      const users = (await getUsers()).data;

      for (const value of data_response) {
        const user = users.find((val) => val.id === value.userId);
        this.data = [
          ...this.data,
          {
            type: `${this.getReservationText(value.type)}`,
            ogType: value.type,
            res: value.roomReservationId,
            user: user.name,
            id: value.id,
            time: new Date(value.created_at).toLocaleString(undefined, {
              dateStyle: 'long',
              timeStyle: 'short',
              timeZone: 'UTC',
            }),
            observations: value.observations,
          },
        ];
      }

      this.$loading.hide();
    },
    getReservationText(type) {
      switch (type) {
        case 'RES_CREATED':
          return 'Reservation created';
        case 'RES_UPDATED':
          return 'Reservation updated';
        case 'RES_DELETED':
          return 'Reservation deleted';
        case 'KEY_GIVEN':
          return 'Key given';
        case 'KEY_RECEIVED':
          return 'Key received';
        default:
          return 'Unkown type';
      }
    },
    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        await deleteEvent(this.data[this.editedIndex].id);
        const deleted = this.data.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry deleted',
          text: `You have deleted entry ${deleted[0].id}`,
        });
      } catch {
        this.$notify({
          type: 'error',
          title: 'Error deleting',
          text: `There was an error deleting the event`,
        });
      } finally {
        this.closeDelete();
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.day = '';
      });
    },
    openObservation(item) {
      this.dialogObs = true;
      this.$nextTick(() => {
        this.editedIndex = this.data.indexOf(item);
        this.editedItem = Object.assign({}, item);
      });
    },
    async addObservation(item) {
      try {
        const updateItem = {
          type: item.ogType,
          roomReservationId: item.res,
          observations: item.observations,
        };

        const response = (await updateEvent(item.id, updateItem)).data;

        this.data = this.data.map((val) => {
          if (val.id === response.id) {
            val.observations = response.observations;
          }

          return val;
        });

        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.id}`,
        });
      } finally {
        this.dialogObs = false;
      }
    },
    cancel() {
      this.dialogObs = false;
    },
  },
};
</script>
