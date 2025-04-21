<template>
  <v-data-table
    :headers="headers"
    :items="hours"
    :sort-by="[{ key: 'id', order: 'desc' }]"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title class="flex-0-0">
          Hours
        </v-toolbar-title>
        <v-divider
          class="mx-4 border-opacity-100"
          vertical
        />
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="550px"
        >
          <template #activator="{ props }">
            <v-btn
              color="secondary"
              variant="elevated"
              class="mb-2 mr-4"
              v-bind="props"
            >
              New Entry
            </v-btn>
          </template>
          <v-card>
            <v-form
              ref="form"
              @submit.prevent="save"
            >
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="11"
                      sm="5"
                    >
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        v-model:return-value="editedItem.entry"
                        :close-on-content-click="false"
                        persistent
                        :offset="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ props }">
                          <v-text-field
                            v-model="editedItem.entry"
                            label="Entry Hours"
                            prepend-icon="mdi-clock-time-four-outline"
                            variant="underlined"
                            readonly
                            required
                            :rules="[() => !!editedItem.entry || 'This field is required']"
                           
                            v-bind="props"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu"
                          v-model="editedItem.entry"
                          :max="editedItem.exit"
                          color="secondary"
                          full-width
                          format="24hr"
                        >
                          <template #actions>
                            <v-btn
                              variant="text"
                              color="success"
                              @click="editedItem.entry = ''; menu = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              variant="text"
                              color="secondary"
                              @click="menu = false"
                            >
                              OK
                            </v-btn>
                          </template>
                        </v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-spacer />
                    <!--Exit hours menu-->
                    <v-col
                      cols="11"
                      sm="5"
                    >
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        v-model:return-value="editedItem.exit"
                        :close-on-content-click="false"
                        persistent
                        :offset="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template #activator="{ props }">
                          <v-text-field
                            v-model="editedItem.exit"
                            label="Exit Hours"
                            prepend-icon="mdi-clock-time-four-outline"
                            variant="underlined"
                            readonly
                            required
                            :rules="[() => !!editedItem.exit || 'This field is required']"
                           
                            v-bind="props"
                          />
                        </template>
                        <v-time-picker
                          v-if="menu2"
                          v-model="editedItem.exit"
                          :min="editedItem.entry"
                          color="secondary"
                          full-width
                          format="24hr"
                        >
                          <template #actions>
                            <v-btn
                              variant="text"
                              color="success"
                              @click="editedItem.exit = ''; menu2 = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              variant="text"
                              color="secondary"
                              @click="menu2 = false"
                            >
                              OK
                            </v-btn>
                          </template>
                        </v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.entry_number"
                      label="Entry ticket"
                      prepend-icon="mdi-ticket-confirmation"
                      variant="underlined"
                      required
                      :rules="[() => !!editedItem.entry_number || 'This field is required']"
                    />
                    <v-spacer />
                    <v-text-field
                      v-model="editedItem.exit_number"
                      label="Exit ticket"
                      prepend-icon="mdi-ticket-confirmation"
                      variant="underlined"
                    />
                    <v-spacer />
                    <v-text-field
                      v-model="editedItem.safe_amount"
                      label="Money in safe"
                      prepend-icon="mdi-safe-square-outline"
                      variant="underlined"
                      required
                      :rules="[() => !!editedItem.safe_amount || 'This field is required']"
                    />
                  </v-row>
                  <v-row v-if="getPermission === 1">
                    <v-menu
                      ref="menu4"
                      v-model="menu4"
                      v-model:return-value="adminDate"
                      :close-on-content-click="false"
                      persistent
                      :offset="40"
                      transition="scale-transition"
                      offset-y
                    >
                      <template #activator="{ props }">
                        <v-text-field
                          v-model="formattedAdminDate"
                          label="Date for entry (OPTIONAL)"
                          prepend-icon="mdi-calendar"
                          variant="underlined"
                          readonly
                          required
                          v-bind="props"
                        />
                      </template>
                      <v-date-picker
                        v-if="menu4"
                        v-model="adminDate"
                        color="secondary"
                        :landscape="true"
                        :reactive="true"
                      >
                        <template #actions>
                          <v-btn
                            variant="text"
                            color="success"
                            @click="adminDate = undefined; menu4 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            variant="text"
                            color="secondary"
                            @click="menu4 = false"
                          >
                            OK
                          </v-btn>
                        </template>
                      </v-date-picker>
                    </v-menu>
                  </v-row>
                  <v-row v-if="getPermission === 1">
                    <v-autocomplete
                      v-model="active_user"
                      label="User"
                      :items="users"
                      item-title="name"
                      item-value="id"
                      :rules="[(v) => !!v || 'User is required']"
                      required
                      variant="filled"
                    />
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  variant="text"
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
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
      </v-toolbar>
    </template>
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
    <template #[`item.actions`]="{ item }">
      <v-icon
        size="small"
        class="mr-2"
        @click="editItem(item)"
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
import { createHours, deleteHours, updateHours, getLastEntry } from '@/api/hours.api';
import { getUsers } from '@/api/user.api';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'HourTable',
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
    dialog: false,
    dialogDelete: false,
    hours: [],
    users: [],
    active_user: '',
    headers: [
      { title: 'Monitor', key: 'user', sortable: false},
      { title: 'Entry Hour', key: 'entry', sortable: false },
      { title: 'Exit Hour', key: 'exit', sortable: false },
      { title: 'Total Time', key: 'time', sortable: false },
      { title: 'Entry Ticket', key: 'entry_number', sortable: false },
      { title: 'Exit Ticket', key: 'exit_number', sortable: false },
      { title: 'Tickets Sold', key: 'sold_amount', sortable: false },
      { title: 'Money in Safe', key: 'safe_amount', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    menu: false,
    menu2: false,
    editedIndex: -1,
    editedItem: {
      entry: '',
      exit: '',
      entry_number: 0,
      exit_number: null,
      safe_amount: 0,
      sold_amount: 0,
    },
    defaultItem: {
      entry: '',
      exit: '',
      entry_number: 0,
      exit_number: null,
      safe_amount: 0,
      sold_amount: 0,
    },
    adminDate: null,
    menu4: null
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Hour Entry' : 'Edit Hour Entry';
    },
    formattedAdminDate() {
      return this.adminDate ? new Date(this.adminDate).toLocaleDateString() : '';
    },
    ...mapGetters('user', ['getPermission']),
  },

  watch: {
    async dialog(val) {
      val || this.close();
      const lastEntry = (await getLastEntry()).data;
      this.editedItem.entry_number = this.editedItem.entry_number
        ? this.editedItem.entry_number
        : lastEntry.exit_number;
      this.editedItem.safe_amount = this.editedItem.safe_amount
        ? this.editedItem.safe_amount
        : lastEntry.safe_amount;
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  async mounted() {
    this.hours = this.propHours;
    this.users = (await getUsers()).data;
    this.active_user = this.users.find((val) => val.current);

  },
  methods: {
    editItem(item) {
      this.editedIndex = this.hours.indexOf(item);
      this.editedItem = {
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
      };
      this.active_user = this.users.find(user => user.id == item.userId);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.hours.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteHours(this.hours[this.editedIndex].id);
        const deleted = this.hours.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry deleted',
          text: `You have deleted entry ${deleted[0].id}`,
        });
      } finally {
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      // Don't save if validation is unsuccessful
      if (!this.$refs.form.validate()) return;
      console.log(this.adminDate);

      try {
        if (this.editedIndex > -1) {
          this.editedItem.entry = moment(this.adminDate).format('YYYY-MM-DD') + 'T' + this.editedItem.entry + ':000Z';
          this.editedItem.exit = moment(this.adminDate).format('YYYY-MM-DD') + 'T' + this.editedItem.exit + ':000Z';
          if (!this.editedItem.exit_number) {
            this.editedItem.exit_number = null;
          }
          console.log("TESTE " + this.editedItem.entry);

          this.editedItem.userId = this.active_user.id ?? this.active_user;

          const response = await updateHours(this.hours[this.editedIndex].id, this.editedItem);

          response.data.sold_amount = (response.data.exit_number ?? 0) - response.data.entry_number;
          console.log(response.data)
          console.log(this.users)
          response.data.user = this.users.find(user => user.id == response.data.userId).name;

          this.hours.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'Entry updated',
            text: `You have updated entry ${response.data.id}`,
          });
        } else {
          this.editedItem.entry = moment(this.adminDate ? this.adminDate : new Date()).format('YYYY-MM-DD') + 'T' + this.editedItem.entry + ':000Z';
          this.editedItem.exit = moment(this.adminDate ? this.adminDate : new Date()).format('YYYY-MM-DD') + 'T' + this.editedItem.exit + ':000Z';
          if (!this.editedItem.exit_number) {
            this.editedItem.exit_number = null;
          }


          const response = await createHours(this.editedItem);

          response.data.sold_amount = response.data.exit_number - response.data.entry_number;
          response.data.user = this.users.find(user => user.id == response.data.userId).name;

          this.hours.push(response.data);
          this.$notify({
            type: 'success',
            title: 'Entry created',
            text: `You have created entry ${response.data.id}`,
          });
        }
      } finally {
        this.close();
      }
    },
  },
};
</script>
