<template>
  <DashboardTable
    v-model:items-per-page="itemsPerPage"
    :type="tableType"
    title="Occurrence List"
    :headers="headers"
    :items="data"
    :items-length="totalItems"
    :loading="tableLoading"
    class="elevation-1"
    @update:options="update"
  />
</template>

<script>
import { getEntries, getEntriesWithPage } from '@/api/entries.api.js';
import moment from 'moment';
import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue';
import { VDataTableServer } from 'vuetify/components';
import { markRaw } from 'vue';

export default {
  components: { DashboardTable },
  data() {
    return {
      tableType: markRaw(VDataTableServer),
      headers: [
        { title: 'Date', key: 'date' },
        { title: 'Entry hour', key: 'entry', sortable: false },
        { title: 'Student number', key: 'stuId' },
        { title: 'Computer', key: 'computer' },
        { title: 'Exit hour', key: 'exit', sortable: false },
        { title: 'Time spent', key: 'spent', sortable: false },
      ],
      data: [],
      totalItems: 0,
      tableLoading: true,
      dates: [],
      itemsPerPage: 10
    };
  },
  watch: {},
  methods: {
    async update({ page, itemsPerPage, sortBy }) {
      this.tableLoading = true;
      this.$loading.show();
      this.data = [];

      if (new Date(this.dates[0]) > new Date(this.dates[1])) this.dates.reverse();

      const response = await getEntriesWithPage(0, page, itemsPerPage, sortBy);
      const data = response.data.entries;
      this.totalItems = response.data.total;

      for (const value of data) {
        const entry = moment(value.createdAt).utcOffset('+0000');
        const exit = moment(value.createdAt).utcOffset('+0000');

        if (value.closedAt) {
          const times = value.closedAt.split(':');
          exit.set({ hour: times[0], minutes: times[1], seconds: times[2] });
        }

        this.data = [
          ...this.data,
          {
            date: entry.format('DD/MM/YYYY'),
            entry: entry.format('HH:mm:SS'),
            stuId: value.istId,
            computer: value.workstation.name,
            exit: value.closedAt ? exit.format('HH:mm:SS') : '-',
            spent: value.closedAt
              ? moment(exit.valueOf() - entry.valueOf())
                  .utcOffset('+0000')
                  .format('HH:mm:SS')
              : '-',
          },
        ];
      }

      this.$loading.hide();
      this.tableLoading = false;
    },
  },
};
</script>
