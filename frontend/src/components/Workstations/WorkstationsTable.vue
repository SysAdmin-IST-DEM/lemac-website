<template>
  <DashboardTable
    title="Workstations"
    :headers="headers"
    :items="workstations"
    search
    :sort-by="[{ key: 'name' }]"
    :new-button="getPermission === 1 ? 'New Workstation' : undefined"
    expand
  >
    <template #[`item.capacity`]="{ item }">
      {{ `${item.occupation} / ${item.capacity}` }}
    </template>
    <template #[`item.type`]="{ item }">
      <v-chip :color="typeColors[item.type]" variant="elevated" class="capitalized">
        {{ (types.find((v) => v.value == item.type) || {}).text }}
      </v-chip>
    </template>

    <template #expanded-row="{ columns, item }">
      <tr>
        <td class="!p-0" :colspan="columns.length">
          <v-container class="!h-full shadow-inner bg-gray-50">
            <v-row>
              <v-col cols="12" md="6">
                <v-list
                  density="compact"
                  class="!bg-gray-50"
                >
                  <v-list-subheader>
                    <span>Softwares</span>
                    <v-btn
                      color="secondary"
                      density="comfortable"
                      icon="mdi-plus"
                      size="small"
                      class="ml-2"
                      @click="addSoftware"
                    />
                  </v-list-subheader>

                  <v-list-item
                    v-for="(software, i) in item.softwares"
                    :key="i"
                    :value="software"
                    :title="software"
                  >
                    <template #prepend>
                      <v-icon>mdi-desktop-classic</v-icon>
                    </template>

                    <template
                      v-if="getPermission === 1"
                      #append
                    >
                      <v-icon
                        size="small"
                        @click="deleteSoftware(item, i)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list
                  density="compact"
                  class="!bg-gray-50"
                  lines="three"
                >
                  <v-list-subheader>
                    <span>Problems</span>
                    <v-btn
                      color="secondary"
                      density="comfortable"
                      icon="mdi-plus"
                      size="small"
                      class="ml-2"
                      @click="addIssue"
                    />
                  </v-list-subheader>

                  <v-list-item
                    v-for="(problem, i) in item.problems"
                    :key="i"
                    :value="problem"
                    class="!min-h-0"
                  >
                    <v-list-item-subtitle>
                      {{ problem.message }}
                    </v-list-item-subtitle>

                    <template #prepend>
                      <v-checkbox
                        v-model="problem.resolved"
                        :disabled="getPermission !== 1"
                        hide-details
                        density="compact"
                        class="mr-1"
                        @update:model-value="(e) => change_issue_status(e, item, i)"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </td>
      </tr>
    </template>
  </DashboardTable>
</template>

<script>
import { createWorkstation, deleteWorkstation, updateWorkstation } from '@/api/workstations.api';
import { mapGetters } from 'vuex';
import DashboardTable from '@/components/DashboardDataTable/DashboardTable.vue';

export default {
  name: 'WorkstationsTable',
  components: { DashboardTable },
  props: {
    passedData: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            name: String,
            capacity: Number,
            occupation: Number,
            type: String,
          },
        ];
      },
    },
  },
  data: () => ({
    workstations: [],
    headers: [
      { title: 'Name', key: 'name' },
      { title: 'Occupation/Capacity', key: 'capacity', filterable: false },
      { title: 'Type', key: 'type' },
      { title: 'Actions', key: 'actions', sortable: false, filterable: false },
    ],
    types: [
      { text: 'Active', value: 'active' },
      { text: 'Disabled', value: 'disabled' },
      { text: 'Remote', value: 'remote' },
    ],
    typeColors: {
      active: 'green',
      disabled: 'red',
      remote: 'blue',
    },
    available_software: [],
    selected_softwares: '',
    issue_description: null,
    software_to_add: null,
    filter_with_issues: false,
    filter_with_unresolved_issues: false,
    select_all: false,
  }),

  computed: {
    ...mapGetters('user', ['getPermission']),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    selected_softwares(val) {
      this.select_all = val.length === this.available_software.length;
    },
  },

  mounted() {
    this.workstations = [...this.passedData];
    console.log(this.workstations);

    const uniqueSoftwareSet = new Set();

    this.available_software = this.workstations.forEach((val) => {
      val.softwares.forEach((software) => {
        uniqueSoftwareSet.add(software);
      });
    });

    this.available_software = Array.from(uniqueSoftwareSet);
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.workstations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.workstations.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteWorkstation(this.workstations[this.editedIndex].id);
        const deleted = this.workstations.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Workstation deleted',
          text: `You have deleted Workstation ${deleted[0].name}`,
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

    close_filter() {
      this.dialog_filter = false;
    },

    save_filter() {
      if (!this.$refs.form_filter.validate()) return;
      this.workstations = [...this.passedData];

      if (!this.select_all)
        this.workstations = [...this.passedData].filter((val) => {
          return this.selected_softwares.reduce(
            (prev, cur) => val.softwares.includes(cur) || prev,
            false
          );
        });

      if (this.filter_with_issues)
        this.workstations = this.workstations.filter((val) => val.problems.length > 0);
      if (this.filter_with_unresolved_issues)
        this.workstations = this.workstations.filter((val) => {
          const test = val.problems.reduce((acc, val) => {
            return acc || !val.resolved;
          }, false);

          return val.problems.length > 0 && test;
        });

      this.close_filter();
    },

    clear_filter() {
      this.workstations = [...this.passedData];

      this.close_filter();
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
      try {
        if (this.editedIndex > -1) {
          const response = await updateWorkstation(
            this.workstations[this.editedIndex].id,
            this.editedItem
          );
          this.workstations.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'Workstation updated',
            text: `You have updated Workstation ${response.data.name}`,
          });
        } else {
          const response = await createWorkstation(this.editedItem);
          this.workstations.push(response.data);
          this.$notify({
            type: 'success',
            title: 'Workstation created',
            text: `You have created Workstation ${response.data.name}`,
          });
        }
      } finally {
        this.close();
      }
    },

    async save_issue(item) {
      if (!this.$refs.form_issue.validate()) return;

      const new_item = { ...item };

      new_item.problems = new_item.problems ?? [];

      new_item.problems.push({
        message: this.issue_description,
        closed: null,
        created: new Date(),
        resolved: false,
      });

      try {
        const response = await updateWorkstation(new_item.id, new_item);
        //this.workstations.splice(this.editedIndex, 1, response.data);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } finally {
        this.close_issue_dialog();
        this.issue_description = '';
      }
    },

    async close_issue_dialog() {
      this.dialog_issue = false;
    },

    async change_issue_status(event, item, problem_index) {
      console.log({ event, item, problem_index });

      const new_item = { ...item };

      new_item.problems[problem_index].resolved = event;
      new_item.problems[problem_index].closed = event ? new Date() : null;

      try {
        const response = await updateWorkstation(new_item.id, new_item);
        //this.workstations.splice(this.editedIndex, 1, response.data);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } catch (e) {
        console.log(e);
      }
    },

    async save_software(item) {
      if (!this.$refs.form_software.validate()) return;

      const new_item = { ...item };

      new_item.softwares.push(this.software_to_add);

      try {
        const response = await updateWorkstation(new_item.id, new_item);
        //this.workstations.splice(this.editedIndex, 1, response.data);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } finally {
        this.close_software_dialog();
      }
    },

    async close_software_dialog() {
      this.dialog_software = false;
    },

    selectAll(event) {
      this.select_all = event;
      this.selected_softwares = event ? [...this.available_software] : [];
    },
  },
};
</script>
