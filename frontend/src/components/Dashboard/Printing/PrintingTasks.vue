<template>
  <DashboardTable
    :headers="headers"
    :items="items"
    :row-props="
      (v: any) => (v.item.status === PrintTaskStatus.WAITING ? { class: 'bg-yellow' } : {})
    "
    :sort-by="[{ key: 'assigned', order: 'asc' }, { key: 'createdAt', order: 'desc' }]"
    title="Tasks"
  >
    <template #toolbar-append>
      <DashboardSelect
        v-model="showFilter"
        :items="['New and Assigned', 'Assigned', 'Assigned with Delivered', 'All']"
      />
    </template>

    <template #[`item.task`]="{ item }">
      <DashboardSelect
        v-if="!item.assigned"
        color="secondary"
        css=""
        default-label="Assign"
        item-label="name"
        item-value="id"
        :items="users"
        @update:model-value="(val: number) => assign(val, item)"
      />

      <span v-else>#{{ item.id }}</span>
    </template>

    <template #[`item.name`]="{ item }">
      {{ item.amount + ' x ' + item.name }}
    </template>

    <template #[`item.status`]="{ item }">
      <v-chip
        class="capitalized"
        :color="statusDictionary[item.status as PrintTaskStatus][1]"
        variant="elevated"
      >
        {{ statusDictionary[item.status as PrintTaskStatus][0] }}
      </v-chip>
    </template>

    <template #[`item.material`]="{ item }">
      {{ item.material?.name || 'N/A' }}
    </template>

    <template #[`item.student`]="{ item }">
      {{ getSmallName(item.student.name) }}
    </template>

    <template #[`item.assigned`]="{ item }">
      {{ item.assigned ? getSmallName(item.assigned.name) : '-' }}
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
    :fields="detailsFields"
    :item="selectedTask"
    max-width="1500px"
    :on-initialization="onDetailsInit"
    :readonly="selectedTask?.status === PrintTaskStatus.WAITING"
    @edit="editTask"
  >
    <template #prepend-title>
      <div />
    </template>

    <template #title> Printing Task Details </template>

    <template #after-row>
      <v-col class="pl-10" cols="12" md="4">
        <v-list density="compact">
          <v-list-subheader>Files:</v-list-subheader>

          <v-list-item
            v-for="file in selectedTask?.modelFiles"
            :key="file"
            color="secondary"
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
          disabled
          variant="compact"
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
  import type { TableHeader } from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue'
  import {
    type EditPrintTaskBody,
    type PrintMaterial,
    type PrintTask,
    PrintTaskStatus,
    Unit,
    type User,
  } from '@lemac/data-model/browser'
  import { DateTime } from 'luxon'
  import { mapState } from 'pinia'
  import httpClient from '@/api/httpClient.api.ts'
  import { getPrintingMaterials } from '@/api/printingMaterials.api.ts'
  import { getPrintTasks, updatePrintingTask } from '@/api/printingTasks.api.ts'
  import { getUsers } from '@/api/user.api.ts'
  import DashboardEditDialog, {
    type EditField,
  } from '@/components/Dashboard/DashboardDataTable/DashboardEditDialog.vue'
  import DashboardSelect from '@/components/Dashboard/DashboardDataTable/DashboardSelect.vue'
  import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue'
  import { useUserStore } from '@/stores/user.ts'

  export default {
    name: 'PrintingTasks',
    components: { DashboardEditDialog, DashboardSelect, DashboardTable },
    data (): {
      headers: TableHeader[]
      rawItems: PrintTask[]
      showFilter: string
      statusDictionary: Record<PrintTaskStatus, [string, string]>
      users: User[]
      materials: PrintMaterial[]
      selectedTask: null | PrintTask
      showDetails: boolean
      baseUrl: string
    } {
      return {
        headers: [
          { title: 'Task', key: 'task', sortable: false },
          { title: 'Quantity x Name', key: 'name' },
          { title: 'Status', key: 'status' },
          { title: 'Material', key: 'material' },
          { title: 'Student', key: 'student' },
          { title: 'Assigned', key: 'assigned' },
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
      }
    },
    computed: {
      DateTime () {
        return DateTime
      },
      PrintTaskStatus () {
        return PrintTaskStatus
      },
      items () {
        return this.rawItems.filter((v: PrintTask) => {
          switch (this.showFilter) {
            case 'All': {
              return true
            }
            case 'New and Assigned': {
              return v.status === PrintTaskStatus.WAITING
                || (v.assignedId === this.getId && v.status !== PrintTaskStatus.DELIVERED && v.status !== PrintTaskStatus.CANCELLED)
            }
            case 'Assigned': {
              return v.status !== PrintTaskStatus.WAITING
                && v.assignedId === this.getId && v.status !== PrintTaskStatus.DELIVERED && v.status !== PrintTaskStatus.CANCELLED
            }
            case 'Assigned with Delivered': {
              return v.assignedId === this.getId && v.status !== PrintTaskStatus.CANCELLED
            }
          // No default
          }
        })
      },
      detailsFields (): EditField[][] {
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
                items: Object.values(PrintTaskStatus).filter(s => s !== PrintTaskStatus.WAITING),
              },
            },
          ],
          [
            {
              key: 'student.name',
              label: 'Student Name',
              props: { readonly: true },
            },
            {
              key: 'student.istId',
              label: 'Student IST-ID',
              props: { readonly: true },
            },
            {
              key: 'student.email',
              label: 'Student Email',
              props: { readonly: true },
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
                items: this.users.map(u => ({ title: u.name, value: u.id })),
              },
            },
          ],
          [
            {
              key: 'materialId',
              type: 'select',
              label: 'Material',
              props: {
                items: this.materials.map(m => ({ title: m.name, value: m.id })),
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
              label: 'Observations',
            },
          ],
        ]
      },
      ...mapState(useUserStore, ['getId', 'getPermission']),
    },
    async mounted () {
      this.rawItems = (await getPrintTasks()).data
      this.users = (await getUsers()).data.filter((u: User) => u.active)
      this.materials = (await getPrintingMaterials()).data
    },
    methods: {
      onDetailsInit (item: PrintTask | undefined) {
        if (!item) return
        return {
          ...item,
          deadline: item.deadline ? DateTime.fromISO(item.deadline as unknown as string) : null,
        }
      },
      async editTask (item: PrintTask | null, values: EditPrintTaskBody) {
        if (item) {
          const response = await updatePrintingTask(item.id, values)

          console.log(values)
          this.rawItems.splice(this.rawItems.indexOf(item), 1, response.data)
          console.log(response.data)
          this.$notify({
            type: 'success',
            title: 'Task updated',
            text: `You have updated the selected task (ID: ${response.data.id})`,
          })
        }
      },
      async downloadFile (filename: string) {
        this.$loading.show()
        const res = await httpClient.get(`/printing/uploads/${filename}`, {
          responseType: 'blob',
        })

        const blob = new Blob([res.data], {
          type: res.headers['content-type'] || 'application/octet-stream',
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.append(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        this.$loading.hide()
      },
      async assign (val: number | null, item: PrintTask) {
        if (val === null) return
        console.log(`Assigning task ${item.id} to user ${val}`)
        item.assignedId = val
        const response = await updatePrintingTask(item.id, {
          assignedId: val,
          status: PrintTaskStatus.PENDING,
        })

        const idx = this.rawItems.findIndex(t => t.id === item.id)
        this.rawItems[idx] = response.data
        this.$notify({
          type: 'success',
          title: 'Task assigned',
          text: `You have assigned task ${response.data.name}`,
        })
        val = null
      },
      getSmallName (name: string): string {
        const parts = name.split(' ')
        if (parts.length >= 2) {
          return parts[0] + ' ' + parts.at(-1)
        }
        return name
      },
    },
  }
</script>
