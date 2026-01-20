<template>
  <DashboardTable
    title="Tasks"
    :headers="headers"
    :items="items"
    :sort-by="[{ key: 'assigned', order: 'asc' }, { key: 'createdAt', order: 'desc' }]"
    :row-props="
      (v: any) => (v.item.status === PrintTaskStatus.WAITING ? { class: 'bg-yellow' } : {})
    "
  >
    <template #toolbar-append>
      <DashboardSelect
        v-model="showFilter"
        :items="['New and Assigned', 'Assigned', 'Assigned with Delivered', 'All']"
      />
    </template>

    <template #[`item.new`]="{ item }">
      <DashboardSelect
        v-if="!item.assigned"
        color="secondary"
        :items="users"
        item-label="name"
        item-value="id"
        default-label="Assign"
        css=""
        @update:model-value="(val: number) => assign(val, item)"
      />
    </template>

    <template #[`item.status`]="{ item }">
      <v-chip
        :color="statusDictionary[item.status as PrintTaskStatus][1]"
        variant="elevated"
        class="capitalized"
      >
        {{ statusDictionary[item.status as PrintTaskStatus][0] }}
      </v-chip>
    </template>

    <template #[`item.material`]="{ item }">
      {{ item.material?.name || 'N/A' }}
    </template>

    <template #[`item.customer`]="{ item }">
      {{ getSmallName(item.studentName) }}
    </template>

    <template #[`item.assigned`]="{ item }">
      {{ item.assigned ? getSmallName(item.assigned.name) : '-' }}
    </template>

    <template #[`item.deadline`]="{ item }">
      {{ item.deadline ? DateTime.fromISO(item.deadline).toFormat('dd/LL/yyyy') : '-' }}
    </template>

    <template #[`item.show`]="{ item }">
      <v-btn
        color="secondary"
        @click="
          selectedTask = item;
          showDetails = true;
        "
      >
        <v-icon size="x-large"> mdi-eye </v-icon>
      </v-btn>
    </template>
  </DashboardTable>

  <DashboardEditDialog
    v-model="showDetails"
    :item="selectedTask"
    :fields="detailsFields"
    :on-initialization="onDetailsInit"
    :readonly="selectedTask?.status === PrintTaskStatus.WAITING"
    max-width="1500px"
    @edit="editTask"
  >
    <template #prepend-title>
      <div />
    </template>

    <template #title> Printing Task Details </template>

    <template #after-row>
      <v-col cols="12" md="4" class="pl-10">
        <v-list density="compact">
          <v-list-subheader>Files:</v-list-subheader>
          <v-list-item
            v-for="file in selectedTask?.modelFiles"
            color="secondary"
            :key="file"
          >
            • {{ file }}
            <v-icon
              color="secondary"
              size="small"
              @click="downloadFile(file)"
            >
              mdi-download
            </v-icon>
          </v-list-item>
        </v-list>

        <v-file-upload
          density="compact"
          variant="compact"
          disabled
        />
      </v-col>
    </template>

    <template
      v-if="selectedTask?.status === PrintTaskStatus.WAITING"
      #footer
    >
      <v-spacer />
      <span class="text-red-400">You can only edit this task if it is assigned to a monitor.</span>
    </template>
  </DashboardEditDialog>
</template>

<script lang="ts">
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import DashboardSelect from '@/components/Dashboard/DashboardDataTable/DashboardSelect.vue';
import { getPrintTasks, updatePrintingTask } from '@/api/printingTasks.api.ts';
import {
  type PrintMaterial,
  type PrintTask,
  type EditPrintTaskBody,
  PrintTaskStatus,
  Unit,
  type User,
} from '@lemac/data-model/browser';
import type { TableHeader } from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user.ts';
import { getUsers } from '@/api/user.api.ts';
import DashboardEditDialog, {
  type EditField,
} from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue';
import { getPrintingMaterials } from '@/api/printingMaterials.api.ts';
import httpClient from '@/api/httpClient.api.ts';
import { DateTime } from 'luxon';

export default {
  name: 'PrintingTasks',
  components: { DashboardEditDialog, DashboardSelect, DashboardTable },
  data(): {
    headers: TableHeader[];
    rawItems: PrintTask[];
    showFilter: string;
    statusDictionary: Record<PrintTaskStatus, [string, string]>;
    users: User[];
    materials: PrintMaterial[];
    selectedTask: null | PrintTask;
    showDetails: boolean;
    baseUrl: string;
  } {
    return {
      headers: [
        { title: 'New', key: 'new', sortable: false },
        { title: 'Name', key: 'name' },
        { title: 'Status', key: 'status' },
        { title: 'Material', key: 'material' },
        { title: 'Customer', key: 'customer' },
        { title: 'Assigned', key: 'assigned' },
        { title: 'Deadline', key: 'deadline' },
        { title: 'Show', key: 'show' },
      ],
      rawItems: [],
      showFilter: 'New and Assigned',
      statusDictionary: {
        WAITING: ['Waiting', 'warning'],
        PENDING: ['Pending', 'blue'],
        IN_QUEUE: ['In Queue', 'orange'],
        PRINTING: ['Printing', 'purple'],
        COMPLETED: ['Completed', 'light-green'],
        DELIVERED: ['Delivered', 'green'],
        CANCELLED: ['Cancelled', 'red'],
      },
      users: [],
      materials: [],
      selectedTask: null,
      showDetails: false,
      baseUrl: import.meta.env.VITE_BASE_URL?.replace(/\/$/, ''),
    };
  },
  computed: {
    DateTime() {
      return DateTime
    },
    PrintTaskStatus() {
      return PrintTaskStatus;
    },
    items() {
      return this.rawItems.filter((v: PrintTask) => {
        if (this.showFilter === 'All') {
          return true;
        } else if (this.showFilter === 'New and Assigned') {
          return v.status === PrintTaskStatus.WAITING ||
            (v.assignedId === this.getId && v.status !== PrintTaskStatus.DELIVERED && v.status !== PrintTaskStatus.CANCELLED);
        } else if (this.showFilter === 'Assigned') {
          return v.status !== PrintTaskStatus.WAITING &&
            v.assignedId === this.getId && v.status !== PrintTaskStatus.DELIVERED && v.status !== PrintTaskStatus.CANCELLED;
        } else if(this.showFilter === 'Assigned with Delivered') {
          return v.assignedId === this.getId && v.status !== PrintTaskStatus.CANCELLED;
        }
      });
    },
    detailsFields(): EditField[][] {
      return [
        [
          {
            key: 'name',
            label: 'Task Name',
          },
          {
            key: 'status',
            type: 'select',
            label: 'Status',
            props: {
              items: Object.values(PrintTaskStatus).filter((s => s !== PrintTaskStatus.WAITING)),
            },
          },
        ],
        [
          {
            key: 'studentName',
            label: 'Customer Name',
          },
          {
            key: 'studentId',
            label: 'Customer IST ID',
          },
          {
            key: 'email',
            label: 'Customer Email',
          },
        ],
        [
          {
            key: 'amount',
            type: 'number',
            label: 'Amount',
          },
          {
            key: 'deadline',
            type: 'date',
            label: 'Deadline',
          },
          {
            key: 'assignedId',
            type: 'select',
            label: 'Assigned Monitor',
            props: {
              items: this.users.map((u) => ({ title: u.name, value: u.id })),
            },
          },
        ],
        [
          {
            key: 'materialId',
            type: 'select',
            label: 'Material',
            props: {
              items: this.materials.map((m) => ({ title: m.name, value: m.id })),
            },
          },
          {
            key: 'unit',
            type: 'select',
            label: 'Unit',
            props: {
              items: Object.values(Unit),
            },
          },
          {
            key: 'price',
            type: 'number',
            label: 'Price (€)',
            props: { precision: 2 },
          },
        ],
        [
          {
            key: 'observations',
            type: 'textarea',
            label: 'Observations'
          }
        ]
      ];
    },
    ...mapState(useUserStore, ['getId', 'getPermission']),
  },
  async mounted() {
    this.rawItems = (await getPrintTasks()).data;
    this.users = (await getUsers()).data.filter((u: User) => u.active);
    this.materials = (await getPrintingMaterials()).data;
  },
  methods: {
    onDetailsInit(item: PrintTask | undefined) {
      if (!item) return;
      return {
        ...item,
        deadline: item.deadline ? DateTime.fromISO(item.deadline as unknown as string) : null,
      }
    },
    async editTask(item: PrintTask | null, values: EditPrintTaskBody) {
      if (item) {
        const response = await updatePrintingTask(item.id, values);

        console.log(values);
        this.rawItems.splice(this.rawItems.indexOf(item), 1, response.data);
        console.log(response.data)
        this.$notify({
          type: 'success',
          title: 'Task updated',
          text: `You have updated the selected task (ID: ${response.data.id})`,
        });
      }
    },
    async downloadFile(filename: string) {
      this.$loading.show();
      const res = await httpClient.get(`/printing/uploads/${filename}`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], {
        type: res.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      this.$loading.hide();
    },
    async assign(val: number | null, item: PrintTask) {
      if (val === null) return;
      console.log(`Assigning task ${item.id} to user ${val}`);
      item.assignedId = val;
      const response = await updatePrintingTask(item.id, {
        assignedId: val,
        status: PrintTaskStatus.PENDING,
      });

      const idx = this.rawItems.findIndex((t) => t.id === item.id);
      this.rawItems.splice(idx, 1, response.data);
      this.$notify({
        type: 'success',
        title: 'Task assigned',
        text: `You have assigned task ${response.data.name}`,
      });
      val = null;
    },
    getSmallName(name: string): string {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[0] + ' ' + parts[parts.length - 1];
      }
      return name;
    },
  },
};
</script>