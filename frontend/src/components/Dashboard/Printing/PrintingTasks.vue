<template>
  <DashboardTable
    :headers="headers"
    :items="items"
  >
    <template #toolbar-append>
      <DashboardSelect
        v-model="showFilter"
        :items="['Assigned and New', 'Assigned', 'All']"
      />
    </template>
  </DashboardTable>
</template>

<script>
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import DashboardSelect from '@/components/Dashboard/DashboardDataTable/DashboardSelect.vue';

export default {
  name: 'PrintingTasks',
  components: { DashboardSelect, DashboardTable },
  data: () => ({
    headers: [
      { title: 'Name', key: 'name' },
      { title: 'Status', key: 'status' },
      { title: 'Material', key: 'material' },
      { title: 'Customer', key: 'customer' },
      { title: 'Monitor', key: 'monitor' },
      { title: 'Deadline', key: 'deadline'},
      { title: 'Actions', key: 'actions'}
    ],
    items: [],
    showFilter: "Assigned and New",
  }),
};
</script>