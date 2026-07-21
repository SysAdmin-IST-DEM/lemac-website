<template>
  <DashboardTable
    :headers="headers"
    :items="hours"
    :sort-by="[{ key: 'id'}]"
    title="Weekly Hours"
  >
    <template #button>
      <v-dialog
        v-model="dialog"
        max-width="450px"
      >
        <template #activator="{ props }">
          <v-btn
            class="mb-2 mr-4"
            color="secondary"
            variant="elevated"
            v-bind="props"
          >
            <v-icon size="large">
              mdi-calendar
            </v-icon>
          </v-btn>
        </template>

        <v-date-picker
          v-model="dates"
          class="py-3"
          color="secondary"
          hide-header
          multiple="range"
          show-adjacent-months
          @update:model-value="update"
        />
      </v-dialog>
    </template>

    <template #[`item.time`]="{ item }">
      {{ Math.floor(parseInt(item.time) / 60) }}h{{ parseInt(item.time % 60) || '' }}
    </template>
  </DashboardTable>
</template>

<script>
  import { DateTime } from 'luxon'
  import { getSumHours } from '@/api/hours.api'
  import DashboardTable from '@/components/Dashboard/DashboardDataTable/DashboardTable.vue'

  export default {
    name: 'SumTable',
    components: { DashboardTable },
    data: () => ({
      dialog: false,
      hours: [],
      dates: [],
      headers: [
        { title: 'Name', key: 'name' },
        { title: 'Time', key: 'time' },
      ],
    }),
    async mounted () {
      this.$loading.show()
      let now = new Date()
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(now.getDate() - now.getDay() + i)
        now = date
        this.dates.push(date)
      }
      const response = await getSumHours(DateTime.fromJSDate(this.dates[0]), DateTime.fromJSDate(this.dates.at(-1)))
      this.hours = response.data
      this.$loading.hide()
    },
    methods: {
      async update () {
        this.$loading.show()

        // reverses the array if the first element selected was the end
        if (this.dates[0] > this.dates.at(-1)) this.dates.reverse()

        const response = await getSumHours(DateTime.fromJSDate(this.dates[0]), DateTime.fromJSDate(this.dates.at(-1)))
        this.hours = response.data
        this.$loading.hide()
      },
    },
  }
</script>
