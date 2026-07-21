<template>
  <v-container>
    <ScheduleCalendar />
  </v-container>
</template>

<script>
  import { mapState } from 'pinia'
  import ScheduleCalendar from '@/components/Dashboard/Schedule/ScheduleCalendar.vue'
  import { useUserStore } from '@/stores/user.js'

  export default {
    name: 'Rooms',
    components: { ScheduleCalendar },
    computed: {
      ...mapState(useUserStore, ['getPermission']),
    },
    methods: {
      goHome () {
        window.location = '/'
      },
    },
  }
</script>
