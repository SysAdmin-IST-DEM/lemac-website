<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet>
        <LemacCalendar :events="events" default-view="month" @change="updateRange">
          <template #event-details="{ event }">
            <p>
              Entry:
              {{
                new Date(event.details.entry).toLocaleString(undefined, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'UTC',
                })
              }}
            </p>
            <p>
              Exit:
              {{
                new Date(event.details.exit).toLocaleString(undefined, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'UTC',
                })
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
import { getHours } from '@/api/hours.api.js';
import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue';
import { DateTime } from 'luxon';

export default {
  components: { LemacCalendar },
  data: () => ({
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    requested: [],
  }),
  methods: {
    async updateRange({ start, end }) {
      this.$loading.show();

      if (!this.requested.includes('' + start.getMonth() + start.getFullYear())) {
        await this.pushEvents(start.getMonth(), start.getFullYear());
        this.requested.push('' + start.getMonth() + start.getFullYear());
      }
      if (!this.requested.includes('' + end.getMonth() + end.getFullYear())) {
        await this.pushEvents(end.getMonth(), end.getFullYear());
        this.requested.push('' + end.getMonth() + end.getFullYear());
      }
      this.$loading.hide();
    },
    async pushEvents(month, year) {
      const allHours = (await getHours(month, year)).data;
      for (let i = 0; i < allHours.length; i++) {
        const color = this.colors[this.rnd(0, this.colors.length - 1)];
        this.events.push({
          id: this.events.length,
          title: allHours[i].user.name,
          start: DateTime.fromISO(allHours[i].entry).toUTC().toFormat("yyyy-MM-dd HH:mm"),
          end: DateTime.fromISO(allHours[i].exit).toUTC().toFormat("yyyy-MM-dd HH:mm"),
          customColor: color,
          class: 'bg-' + color,
          details: allHours[i],
        });
      }
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style scoped>
::v-deep(.vuecal--default-theme) {
  --vuecal-height: auto !important;
}

::v-deep(.vuecal--default-theme) {
  min-height: 500px !important;
}
</style>