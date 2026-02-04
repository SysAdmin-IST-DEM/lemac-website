<template>
  <v-container class="bg-white">
    <v-row>
      <DashboardSelect
        v-model="selectedWindow"
        :items="['1 Week', '3 Months', '1 Year', 'Infinite']"
        @update:modelValue="updateCharts"
      />
      <canvas id="count-by-time-window" />
    </v-row>

    <v-row>
      <canvas id="count-by-workstation" />
    </v-row>

    <v-row>
      <canvas id="count-by-hour" />
    </v-row>
  </v-container>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { getEntries } from '@/api/entries.api';
import DashboardSelect from '@/components/Dashboard/DashboardDataTable/DashboardSelect.vue';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';

Chart.register(...registerables)

export default {
  name: 'WorkstationData',
  components: { DashboardSelect },
  data() {
    return {
      selectedWindow: 'Infinite',
      allEntries: [],
      charts: {
        timeWindow: null,
        workstation: null,
        hour: null
      }
    }
  },
  async mounted() {
    this.$loading.show();
    try {
      const { data } = await getEntries();
      this.allEntries = data;
      this.updateCharts();
    } catch (e) {
      console.error(e);
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    updateCharts() {
      const data = this.getFilteredData();

      if (this.charts.timeWindow) this.charts.timeWindow.destroy();
      if (this.charts.workstation) this.charts.workstation.destroy();
      if (this.charts.hour) this.charts.hour.destroy();

      this.initTimeWindowChart(data);
      this.initWorkstationChart(data);
      this.initHourChart(data);
    },

    getFilteredData() {
      if (this.selectedWindow === 'Infinite') return this.allEntries;

      const now = DateTime.now();
      let cutoff;

      if (this.selectedWindow === '1 Week') cutoff = now.minus({ weeks: 1 });
      else if (this.selectedWindow === '3 Months') cutoff = now.minus({ months: 3 });
      else if (this.selectedWindow === '1 Year') cutoff = now.minus({ years: 1 });

      return this.allEntries.filter(entry =>
        DateTime.fromISO(entry.createdAt) >= cutoff
      );
    },

    initTimeWindowChart(data) {
      const counts = {};

      data.forEach(entry => {
        const bucket = DateTime.fromISO(entry.createdAt).toFormat('yyyy-MM');
        counts[bucket] = (counts[bucket] || 0) + 1;
      });

      const chartData = Object.entries(counts)
        .map(([key, value]) => ({
          x: DateTime.fromFormat(key, 'yyyy-MM'),
          y: value
        }))
        .sort((a, b) => a.x.toMillis() - b.x.toMillis());

      this.charts.timeWindow = new Chart(document.getElementById('count-by-time-window'), {
        type: "line",
        data: {
          datasets: [{
            label: "Entries per Month",
            data: chartData,
            borderColor: "#36495d",
            backgroundColor: "rgba(54,73,93,.2)",
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: this.selectedWindow === 'Infinite' ? 'year' : 'month'
              }
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Entries' }
            }
          }
        }
      });
    },

    initWorkstationChart(data) {
      const workstation_data = new Map();
      for (const val of data) {
        const id = val.workstationId;
        if (!id) continue;
        const existing = workstation_data.get(id) || { workstation: val.workstation, count: 0 };
        existing.count++;
        workstation_data.set(id, existing);
      }

      const sortedMap = new Map([...workstation_data.entries()].sort((a, b) => a[0] - b[0]));
      const values = Array.from(sortedMap.values());

      this.charts.workstation = new Chart(document.getElementById('count-by-workstation'), {
        type: "line",
        data: {
          labels: values.map(v => v.workstation.name),
          datasets: [{
            label: "Users per Workstation",
            data: values.map(v => v.count),
            backgroundColor: "rgba(54,73,93,.5)",
            borderColor: "#36495d",
            borderWidth: 3
          }]
        }
      });
    },

    initHourChart(data) {
      let intervals = [];
      for (let i = 9; i <= 20; i++) {
        let start = new Date();
        start.setHours(i, 0, 0, 0);
        intervals.push(start);
      }

      let time_data = intervals.map(intervalStart => {
        const count = data.reduce((acc, curr) => {
          let closedAt = curr.closedAt ? curr.closedAt.split(':') : [];
          let createdAt = new Date(curr.createdAt);

          let closed_date = new Date();
          closed_date.setHours(closedAt[0] || 0, closedAt[1] || 0, closedAt[2] || 0);

          let created_date = new Date();
          created_date.setHours(createdAt.getHours(), createdAt.getMinutes(), createdAt.getSeconds());

          let intervalEnd = new Date(intervalStart);
          intervalEnd.setHours(intervalEnd.getHours() + 1);

          return (created_date < intervalEnd && closed_date >= intervalEnd) ? acc + 1 : acc;
        }, 0);
        return { time_interval: intervalStart, count };
      });

      this.charts.hour = new Chart(document.getElementById('count-by-hour'), {
        type: "line",
        data: {
          labels: time_data.map(e => e.time_interval.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })),
          datasets: [{
            label: "Users by Hour",
            data: time_data.map(e => e.count),
            borderColor: "#36495d",
            borderWidth: 3
          }]
        }
      });
    }
  }
}
</script>