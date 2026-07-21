<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet>
        <LemacCalendar default-view="month" :events="events" @change="updateRange">
          <template #event-details="{ event }">
            <p>
              Entry:
              {{
                DateTime.fromISO(event.details.entry).toFormat("yyyy-MM-dd HH:mm")
              }}
            </p>

            <p>
              Exit:
              {{
                DateTime.fromISO(event.details.exit).toFormat("yyyy-MM-dd HH:mm")
              }}
            </p>

            <p>
              Time: {{ Math.floor(parseInt(event.details.time) / 60) }}h{{
                parseInt(event.details.time % 60) || ''
              }}
            </p>
          </template>
        </LemacCalendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import { DateTime } from 'luxon'
  import { getHours } from '@/api/hours.api'
  import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue'

  export default {
    components: { LemacCalendar },
    data: () => ({
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      requested: [],
    }),
    computed: {
      DateTime () {
        return DateTime
      },
    },
    methods: {
      async updateRange ({ start, end }) {
        this.$loading.show()

        if (!this.requested.includes('' + (start.getMonth() + 1) + start.getFullYear())) {
          await this.pushEvents(start.getMonth() + 1, start.getFullYear())
          this.requested.push('' + (start.getMonth() + 1) + start.getFullYear())
        }
        if (!this.requested.includes('' + (end.getMonth() + 1) + end.getFullYear())) {
          await this.pushEvents(end.getMonth() + 1, end.getFullYear())
          this.requested.push('' + (end.getMonth() + 1) + end.getFullYear())
        }
        this.$loading.hide()
      },
      async pushEvents (month, year) {
        const allHours = (await getHours(month, year)).data
        for (const allHour of allHours) {
          const color = this.colors[this.rnd(0, this.colors.length - 1)]
          this.events.push({
            id: this.events.length,
            title: allHour.user.name,
            start: DateTime.fromISO(allHour.entry).toFormat("yyyy-MM-dd HH:mm"),
            end: DateTime.fromISO(allHour.exit).toFormat("yyyy-MM-dd HH:mm"),
            customColor: color,
            class: 'bg-' + color,
            details: allHour,
          })
        }
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>

<style scoped>
::v-deep(.vuecal--default-theme) {
  --vuecal-height: auto !important;
}

::v-deep(.vuecal--default-theme) {
  min-height: 500px !important;
}
</style>
