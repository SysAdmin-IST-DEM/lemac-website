<template>
  <DashboardTable
    v-model:items-per-page="itemsPerPage"
    :type="tableType"
    title="Occurrence List"
    :headers="headers"
    :items="data"
    :items-length="totalItems"
    :loading="tableLoading"
    :sort-by="[{ key: 'date', order: 'desc' }]"
    class="elevation-1"
    @update:options="update"
  >
    <template #[`item.source`]="{ item }">
      <v-icon>
        {{ item.source === 'CARD' ? 'mdi-smart-card' : 'mdi-monitor-account' }}
      </v-icon>
    </template>
  </DashboardTable>
</template>

<script>
import { getEntriesWithPage } from '@/api/entries.api';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { VDataTableServer } from 'vuetify/components';
import { markRaw } from 'vue';
import { DateTime } from 'luxon';

export default {
  components: { DashboardTable },
  data() {
    return {
      tableType: markRaw(VDataTableServer),
      headers: [
        { title: 'Source', key: 'source' },
        { title: 'Date', key: 'date' },
        { title: 'Entry hour', key: 'entry', sortable: false },
        { title: 'Student number', key: 'istId' },
        { title: 'Computer', key: 'computer', sortable: false },
        { title: 'Exit hour', key: 'exit', sortable: false },
        { title: 'Time spent', key: 'spent', sortable: false },
      ],
      data: [],
      totalItems: 0,
      tableLoading: true,
      itemsPerPage: 10
    };
  },
  watch: {},
  methods: {
    async update({ page, itemsPerPage, sortBy }) {
      this.tableLoading = true;
      this.$loading.show();
      this.data = [];

      const response = await getEntriesWithPage(0, page, itemsPerPage, sortBy);
      const data = response.data.entries;
      this.totalItems = response.data.total;

      for (const value of data) {
        const entry = DateTime.fromISO(value.createdAt);
        let exit = DateTime.fromISO(value.createdAt);

        if (value.closedAt) {
          const times = value.closedAt.split(':');
          exit = exit.set({ hour: times[0], minute: times[1], second: times[2] });
          console.log(times, value.closedAt, exit.toFormat('HH:mm:ss'));
        }

        this.data = [
          ...this.data,
          {
            date: entry.toFormat('dd/MM/yyyy'),
            entry: entry.toFormat('HH:mm:ss'),
            istId: value.istId,
            computer: value.workstation.name,
            exit: value.closedAt ? exit.toFormat('HH:mm:ss') : '-',
            spent: value.closedAt ? exit.diff(entry).toFormat('hh:mm:ss') : '-',
            source: value.source
          },
        ];
      }

      this.$loading.hide();
      this.tableLoading = false;
    },
  },
};
</script>
