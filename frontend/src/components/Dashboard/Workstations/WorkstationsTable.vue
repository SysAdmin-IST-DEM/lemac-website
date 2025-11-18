<template>
  <DashboardTable
    title="Workstations"
    :headers="headers"
    :items="workstations"
    search
    :sort-by="[{ key: 'name' }]"
    :new-button="getPermission === 1 ? 'New Workstation' : undefined"
    :edit-initialization="editInitialization"
    :edit-fields="editFields"
    expand
    :custom-filter="filterWorkstations"
    @edit="editItem"
    @delete="deleteItem"
  >
    <template #[`item.capacity`]="{ item }">
      {{ `${item.occupation} / ${item.capacity}` }}
    </template>
    <template #[`item.type`]="{ item }">
      <v-chip :color="typeColors[item.type]" variant="elevated" class="capitalized">
        {{ (types.find((v) => v.value == item.type) || {}).title }}
      </v-chip>
    </template>

    <template #expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" class="!p-0">
          <v-container
            fluid
            class="shadow-inner bg-gray-50"
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-list
                  density="compact"
                  class="!bg-gray-50"
                >
                  <v-list-subheader>
                    <span>Softwares</span>
                    <v-btn
                      v-if="getPermission === 1"
                      color="secondary"
                      density="comfortable"
                      icon="mdi-plus"
                      size="small"
                      class="ml-2"
                      @click="openSoftwareDialog(item)"
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
                      @click="openIssueDialog(item)"
                    />
                  </v-list-subheader>

                  <v-list-item
                    v-for="(problem, i) in item.problems.filter(p => !p.closed)"
                    :key="i"
                    :value="problem"
                    class="!min-h-0"
                  >
                    <v-list-item-subtitle>
                      {{ problem.message }}
                    </v-list-item-subtitle>

                    <template #prepend>
                      <v-checkbox
                        v-model="problem.closed"
                        :disabled="getPermission !== 1"
                        hide-details
                        density="compact"
                        class="mr-1"
                        @update:model-value="(e) => changeIssueStatus(e, item, i)"
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

  <v-dialog
    v-model="expanded_dialog_open"
    max-width="550px"
  >
    <v-card>
      <v-form
        :ref="`form`"
        @submit.prevent="expanded_dialog === 'software' ? addSoftware() : addIssue()"
      >
        <v-card-title>
          <span>Add</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="expanded_dialog_text"
            :label="expanded_dialog === 'software' ? 'Sofware to add' : 'Issue to report'"
            variant="outlined"
            :rules="[(v) => !!v || 'Field is required']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="expanded_dialog_open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
          >
            {{ expanded_dialog === 'software' ? 'Add Software' : 'Report' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { createWorkstation, deleteWorkstation, updateWorkstation } from '@/api/workstations.api';
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';

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
      { title: 'Actions', key: 'actions', sortable: false, filterable: false, permission: 1 },
    ],
    types: [
      { title: 'Active', value: 'active' },
      { title: 'Disabled', value: 'disabled' },
      { title: 'Remote', value: 'remote' },
    ],
    typeColors: {
      active: 'green',
      disabled: 'error',
      remote: 'blue',
    },
    expanded_dialog: null,
    expanded_dialog_item: null,
    expanded_dialog_text: '',
  }),
  computed: {
    editFields() {
      return [
        [
          { key: 'name', label: 'Name', required: true },
        ],
        [
          { key: 'capacity', label: 'Capacity', required: true, props: { type: 'number' } },
          { key: 'type', type: 'select', label: 'Type', required: true, props: { items: this.types } },
        ],
      ];
    },
    expanded_dialog_open: {
      get() {
        return this.expanded_dialog !== null;
      },
      set(value) {
        if (!value) {
          this.expanded_dialog = null;
          this.expanded_dialog_text = '';
        }
      },
    },
    ...mapState(useUserStore, ['getPermission']),
  },
  mounted() {
    this.workstations = [...this.passedData];

    const uniqueSoftwareSet = new Set();
    this.available_software = this.workstations.forEach((val) => {
      val.softwares.forEach((software) => {
        uniqueSoftwareSet.add(software);
      });
    });
    this.available_software = Array.from(uniqueSoftwareSet);
  },
  methods: {
    editInitialization(item) {
      return Object.assign({}, item);
    },
    async editItem(item, values) {
      if(item) {
        const response = await updateWorkstation(
          item.id,
          values
        );
        this.workstations.splice(this.workstations.indexOf(item), 1, response.data);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } else {
        const response = await createWorkstation(values);
        this.workstations.push(response.data);
        this.$notify({
          type: 'success',
          title: 'Workstation created',
          text: `You have created Workstation ${response.data.name}`,
        });
      }
    },
    async deleteItem(item) {
      await deleteWorkstation(item.id);
      const deleted = this.workstations.splice(this.workstations.indexOf(item), 1);
      this.$notify({
        type: 'success',
        title: 'Workstation deleted',
        text: `You have deleted Workstation ${deleted[0].name}`,
      });
    },

    openSoftwareDialog(item) {
      this.expanded_dialog = 'software';
      this.expanded_dialog_item = item;
    },
    async addSoftware() {
      const item = this.expanded_dialog_item;
      const { valid } = await this.$refs[`form`].validate();
      if (!valid) return;

      try {
        this.$loading.show();

        item.softwares.push(this.expanded_dialog_text);
        const response = await updateWorkstation(item.id, item);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } finally {
        this.expanded_dialog_open = false;
        this.$loading.hide();
      }
    },
    async deleteSoftware(item, i) {
      if (this.getPermission !== 1) return;

      try {
        item.softwares.splice(i, 1);

        const response = await updateWorkstation(item.id, item);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } catch (e) {
        console.error(e);
      }
    },

    async openIssueDialog(item) {
      this.expanded_dialog = 'issue'
      this.expanded_dialog_item = item;
    },
    async addIssue() {
      const item = this.expanded_dialog_item;
      const { valid } = await this.$refs[`form`].validate();
      if (!valid) return;

      const issue = {
        message: this.expanded_dialog_text,
        created: new Date(),
        closed: null,
      }

      try {
        this.$loading.show();

        item.problems.push(issue);
        const response = await updateWorkstation(item.id, item);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } finally {
        this.expanded_dialog_open = false;
        this.$loading.hide();
      }
    },
    async changeIssueStatus(event, item, problem_index) {
      item.problems[problem_index].closed = event ? new Date() : null;

      try {
        const response = await updateWorkstation(item.id, item);
        this.$notify({
          type: 'success',
          title: 'Workstation updated',
          text: `You have updated Workstation ${response.data.name}`,
        });
      } catch (e) {
        console.error(e);
      }
    },
    filterWorkstations(value, search, item) {
      return item.raw.name.toLowerCase().includes(search.toLowerCase()) ||
        item.raw.softwares.some(v => v.toLowerCase().includes(search.toLowerCase()));
    },
  },
};
</script>
