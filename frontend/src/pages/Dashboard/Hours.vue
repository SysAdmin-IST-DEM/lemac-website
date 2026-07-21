<template>
  <div v-if="getPermission === 1">
    <v-tabs
      v-model="tab"
      bg-color="white"
      color="primary"
      grow
      slider-color="primary"
    >
      <v-tab value="1">
        Personal Hours
      </v-tab>

      <v-tab value="2">
        Calendar
      </v-tab>

      <v-tab value="3">
        Hour Table
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1">
        <v-container v-if="hours">
          <HourTable :prop-hours="hours" />
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item value="2">
        <v-container>
          <HoursCalendar />
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item value="3">
        <v-container>
          <SumTable />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <div v-else>
    <v-container
      v-if="hours"
      class="mt-6"
    >
      <HourTable :prop-hours="hours" />
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'pinia'
  import { getHours, getHoursSelf } from '@/api/hours.api'
  import HoursCalendar from '@/components/Dashboard/Hours/HoursCalendar.vue'
  import HourTable from '@/components/Dashboard/Hours/HoursTable.vue'
  import SumTable from '@/components/Dashboard/Hours/SumTable.vue'
  import { useUserStore } from '@/stores/user.js'

  export default {
    name: 'Hours',
    components: { HourTable, HoursCalendar, SumTable },
    data () {
      return {
        tab: null,
        hours: null,
      }
    },
    computed: {
      ...mapState(useUserStore, ['getPermission']),
    },
    async mounted () {
      this.$loading.show()
      const response = this.getPermission === 1 ? await getHours(-1, -1) : await getHoursSelf()

      const data = response.data.map(val => {
        val.soldAmount = val.exitNumber - val.entryNumber
        val.user = val.user.name

        return val
      })

      this.hours = data
      this.$loading.hide()
    },
  }
</script>

<style></style>
