<template>
  <div class="elevation-1">
    <v-toolbar flat>
      <v-toolbar-title class="flex-0-0">
        Lab Entries
      </v-toolbar-title>
      <v-divider
        class="mx-4 border-opacity-100"
        vertical
        inset
      />
      <v-text-field
        v-model="search"
        class="mt-2"
        label="Filter Workstations"
        variant="underlined"
        color="secondary"
      />
      <v-spacer />
      <v-btn
        color="error"
        variant="elevated"
        class="mb-2 mr-4"
        title="Clear all entries"
        @click="clearAllEntries"
      >
        <v-icon>mdi-delete-sweep-outline</v-icon>
      </v-btn>
      <v-dialog
        v-model="dialogAdd"
        max-width="550px"
      >
        <template #activator="{ props }">
          <v-btn
            color="secondary"
            variant="elevated"
            class="mb-2 mr-4"
            v-bind="props"
          >
            New Registration
          </v-btn>
        </template>
        <v-card>
          <v-form
            ref="formAdd"
            @submit.prevent="save"
          >
            <v-card-title>
              <span class="text-h5"> New Registration </span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div
                    v-for="(number, i) in numberList"
                    :key="i + 'a'"
                  >
                    <v-text-field
                      v-model="numberList[i]"
                      :rules="[(v) => !!v || 'IST Id is required']"
                      label="Id"
                      type="number"
                      required
                      variant="filled"
                    />
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  class="flex items-center justify-center"
                >
                  <v-autocomplete
                    v-model="newItem.workstationId"
                    label="Workstation"
                    :items="workstations"
                    item-title="name"
                    item-value="id"
                    :rules="[(v) => !!v || 'Workstation is required']"
                    required
                    variant="filled"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                variant="text"
                @click="add"
              >
                Add Number
              </v-btn>
              <v-btn
                color="primary"
                variant="text"
                @click="remove"
              >
                Remove Number
              </v-btn>
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
    </v-toolbar>
    <v-list>
      <template v-if="entries.length > 0">
        <div
          v-for="(entry, index) in filteredEntries"
          :key="entry.id + 'b'"
        >
          <v-list-item>
            <v-list-item-title class="mb-2">
              <v-chip
                color="secondary"
                variant="elevated"
              >
                {{ entry.istId.slice(4) }}
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon
                start
                end
                size="small"
              >
                mdi-desktop-classic
              </v-icon> {{ entry.workstation.name }}
              <v-icon
                start
                end
                size="small"
              >
                mdi-clock
              </v-icon>
              {{ new Date(entry.createdAt).toLocaleString('pt-PT') }}
              <v-icon
                start
                end
                size="small"
              >
                mdi-text
              </v-icon>
              {{ entry.observations }}
            </v-list-item-subtitle>

            <template #append>
              <v-tooltip
                location="bottom"
                open-delay="500"
              >
                <template #activator="{ props }">
                  <v-btn
                    class="ma-1"
                    color="primary"
                    size="small"
                    v-bind="props"
                    @click="editEntry(entry)"
                  >
                    <v-icon
                      color="white"
                      size="large"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                Edit
              </v-tooltip>
              <v-tooltip
                location="bottom"
                open-delay="500"
              >
                <template #activator="{ props }">
                  <v-btn
                    class="ma-1"
                    size="small"
                    color="green"
                    v-bind="props"
                    @click="addObservation(entry)"
                  >
                    <v-icon
                      color="white"
                      size="large"
                    >
                      mdi-text
                    </v-icon>
                  </v-btn>
                </template>
                Observations
              </v-tooltip>
              <v-tooltip
                location="bottom"
                open-delay="500"
              >
                <template #activator="{ props }">
                  <v-btn
                    class="ma-1"
                    color="error"
                    size="small"
                    v-bind="props"
                    @click="closeEntry(entry)"
                  >
                    <v-icon
                      color="white"
                      size="large"
                    >
                      mdi-close
                    </v-icon>
                  </v-btn>
                </template>
                Close Entry
              </v-tooltip>
            </template>
          </v-list-item>
          <v-divider
            v-if="index < entries.length - 1"
            :key="index + 'c'"
          />
        </div>
      </template>
      <!-- template for empty list -->
      <template v-else>
        <v-list-item key="0">
          There are no active entries in the lab!
        </v-list-item>
      </template>
      <v-dialog
        v-model="dialog"
        max-width="550px"
      >
        <v-card>
          <v-form
            ref="formEdit"
            @submit.prevent="save"
          >
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
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
                @click="observationsClose"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="text"
                @click="observationsSave"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogClose"
        max-width="500px"
      >
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to close this entry?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              variant="text"
              @click="closeCancel"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              @click="closeConfirm"
            >
              Close
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list>

    <v-dialog
      v-if="editEntryModal"
      v-model="editEntryModal"
      max-width="550px"
    >
      <v-card>
        <v-form
          ref="formAdd"
          @submit.prevent="save"
        >
          <v-card-title>
            <span class="text-h5"> Edit Registration </span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="editingEntry.number"
                  :rules="[(v) => !!v || 'IST Id is required']"
                  label="Id"
                  type="number"
                  required
                  variant="filled"
                />
              </v-col>
              <v-col
                cols="6"
                class="flex items-center justify-center"
              >
                <v-autocomplete
                  v-model="editingEntry.workstationId"
                  label="Workstation"
                  :items="workstations"
                  item-title="name"
                  item-value="id"
                  :rules="[(v) => !!v || 'Workstation is required']"
                  required
                  variant="filled"
                />
              </v-col>
            </v-row>
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
              @click="edit"
            >
              Edit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getEntries, updateEntry, addEntry } from '@/api/entries.api.js';
import { getWorkstations } from '@/api/workstations.api.js';

export default {
  data() {
    return {
      entries: [],
      search: '',
      numberList: [null],
      workstations: [],
      editedItem: {
        active: 1,
        observations: '',
      },
      newItem: {
        istId: '',
        workstationId: '',
      },
      dialog: false,
      dialogAdd: false,
      dialogClose: false,
      editedIndex: -1,
      editEntryModal: false,
      editingEntry: null,
    };
  },
  computed: {
    formTitle() {
      return this.editedItem === -1 ||
        (this.entries[this.editedIndex]?.observations ?? '').length === 0
        ? 'Add Observations'
        : 'Edit Observations';
    },
    filteredEntries() {
      if (!this.search.trim()) {
        // If search is empty, return all entries
        return this.entries;
      } else {
        // Filter entries based on search
        return this.entries.filter((entry) =>
          entry.workstation.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
    },
  },
  watch: {
    async dialogAdd(val) {
      if (val) await this.loadWorkstations();
      else this.close();
    },
    dialog(val) {
      val || this.observationsClose();
    },
    dialogClose(val) {
      val || this.closeCancel();
    },
  },
  async mounted() {
    this.$loading.show();
    const { data } = await getEntries(1);
    console.log(data);
    this.entries = data;
    this.$loading.hide();
  },
  methods: {
    // trigger methods
    addObservation(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.editedItem = item;
      this.editedItem.observations = item.observations;
      this.dialog = true;
    },
    closeEntry(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.dialogClose = true;
    },
    // dont touch this cancer again - lol have to kek (ass hugo)
    async loadWorkstations() {
      this.$loading.show();
      let { data } = await getWorkstations();
      data = data.sort((v1, v2) => (v1.name.match(/\d+/)[0] < v2.name.match(/\d+/)[0] ? -1 : 1));

      let available = data.filter((x) => x.occupation == 0 && x.occupation != x.capacity);
      let partlyAvailable = data.filter((x) => x.occupation > 0 && x.occupation < x.capacity);
      let notAvailable = data.filter((x) => x.type === 'disabled' || x.occupation === x.capacity);

      const workstationsSorted = [{ header: 'Available' }];
      available.forEach((x) => workstationsSorted.push(x));
      workstationsSorted.push({ header: 'Partly Available' });
      partlyAvailable.forEach((x) => workstationsSorted.push(x));
      workstationsSorted.push({ header: 'Not Available' });
      notAvailable.forEach((x) => workstationsSorted.push({ ...x, disabled: 'true' }));

      this.workstations = workstationsSorted;
      this.$loading.hide();
    },
    // close entry methods
    closeCancel() {
      this.dialogClose = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
    async closeConfirm() {
      try {
        await updateEntry(this.entries[this.editedIndex].id, { active: 0 });
        const closed = this.entries.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry closed',
          text: `You have closed entry the entry on ${closed[0].workstation.name}`,
        });
      } finally {
        this.closeCancel();
      }
    },
    async clearAllEntries() {
      this.$loading.show();
      for (const entry of this.entries) {
        await updateEntry(entry.id, { active: 0 });
      }
      this.entries = [];
      this.$notify({
        type: 'success',
        title: 'All entries closed',
        text: `You have closed all registered entries`,
      });
      this.$loading.hide();
    },
    // observations methods
    observationsClose() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
        this.editedItem.observations = '';
      });
    },
    async observationsSave() {
      try {
        const { data } = await updateEntry(this.entries[this.editedIndex].id, this.editedItem);
        this.entries.splice(this.editedIndex, 1, data);
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated an entry for workstation ${data.workstation.name}`,
        });
      } finally {
        this.observationsClose();
      }
    },
    // add entry methods
    close() {
      this.dialogAdd = false;
      this.editEntryModal = false;
      this.$refs.formAdd.resetValidation();
      this.$nextTick(() => {
        this.newItem = {
          istId: '',
          workstationId: '',
        };
      });
    },
    async save() {
      if (!this.$refs.formAdd.validate()) return;
      this.close();
      try {
        for (const number of this.numberList) {
          const { data } = await addEntry({
            istId: 'ist1' + number,
            workstationId: this.newItem.workstationId,
          });

          this.entries.push(data);

          this.$notify({
            type: 'success',
            title: 'Entry created',
            text: `You have created an entry for workstation ${data.workstation.name}`,
          });
        }
      } finally {
        this.numberList = [null];
      }
    },
    async edit() {
      if (!this.$refs.formAdd.validate()) return;
      this.close();
      try {
        this.editingEntry.istId = `ist1${this.editingEntry.number}`;

        const { data } = await updateEntry(this.editingEntry.id, this.editingEntry);
        this.entries.splice(this.editedIndex, 1, data);
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated an entry for workstation ${data.workstation.name}`,
        });
      } finally {
        this.numberList = [null];
      }
    },
    add() {
      this.numberList = [...this.numberList, null];
    },
    remove() {
      let temp = this.numberList;
      temp.pop();
      this.numberList = temp;
    },
    async editEntry(entry) {
      await this.loadWorkstations();
      this.editedIndex = this.entries.indexOf(entry);

      this.editEntryModal = true;
      this.editingEntry = entry;
      this.editingEntry.number = this.editingEntry.istId.split('ist1')[1];
    },
  },
};
</script>

<style></style>
