<template>
  <v-row class="fill-height">
    <v-col>
      <LemacCalendar
        ref="calendar"
        class="bg-white"
        :clickable-event="false"
        :disable-days="offDaysDates"
        :editable-events="editMode"
        :events="events"
        hide-weekends
        :snap-to-interval="15"
        :start-week-on-sunday="false"
        :time-to="1260"
        @event-click="showDelete"
        @event-create="createEvent"
        @event-dblclick="false"
        @event-delete="deleteEvent"
      >
        <template #dropdowns>
          <v-switch
            v-model="editMode"
            class="mr-4 mt-5"
            color="secondary"
            inset
            label="Edit mode"
          />

          <v-menu location="bottom right">
            <template #activator="{ props }">
              <v-btn
                class="mr-4"
                color="secondary"
                variant="elevated"
                v-bind="props"
              >
                <span>{{ currentUser ? currentUser.name : 'User' }}</span>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(user, index) in users"
                :key="index"
                @click="currentUser = user"
              >
                <v-list-item-title>{{ user.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </LemacCalendar>

      <v-sheet class="flex! flex-row items-center justify-start py-3 gap-3">
        <ScheduleFooter
          :calendar="$refs.calendar"
          :current-user="currentUser"
          :schedule="this"
          @update-off-days="reloadOffDays"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import { DateTime } from 'luxon'
  import { mapState } from 'pinia'
  import {
    createHours,
    deleteHours,
    getHours,
    getOffDays,
  } from '@/api/schedule.api'
  import { getUsers } from '@/api/user.api'
  import ScheduleFooter from '@/components/Dashboard/Schedule/ScheduleFooter.vue'
  import LemacCalendar from '@/components/LemacCalendar/LemacCalendar.vue'
  import { useUserStore } from '@/stores/user.js'

  export default {
    components: { ScheduleFooter, LemacCalendar },
    data: () => ({
      editMode: false,
      events: [],
      offDays: [],
      users: [],
      currentUser: null,
    }),
    computed: {
      offDaysDates () {
        return this.offDays.map(val => DateTime.fromISO(val.date).toFormat("yyyy-MM-dd"))
      },
      ...mapState(useUserStore, ['getPermission']),
    },
    async mounted () {
      this.$loading.show()

      this.users = (await getUsers()).data
      const inactiveUsers = this.users.filter(user => !user.active)
      this.users = this.users.filter(user => user.active)
      this.currentUser = this.users.find(user => user.current)

      let events = (await getHours()).data
      events = events.map(val => {
        let user = this.users.find(user => user.id === val.userId)
        if (!user) user = inactiveUsers.find(user => user.id === val.userId)
        if (user === undefined)
          return {
            id: val.id,
            title: 'Unknown',
            start: DateTime.fromISO(val.entry).toFormat("yyyy-MM-dd HH:mm"), // TODO toDate()??
            end: DateTime.fromISO(val.exit).toFormat("yyyy-MM-dd HH:mm"),
            details: val,
          }

        return {
          id: val.id,
          title: user.name,
          start: DateTime.fromISO(val.entry).toFormat("yyyy-MM-dd HH:mm"), // TODO toDate()??
          end: DateTime.fromISO(val.exit).toFormat("yyyy-MM-dd HH:mm"),
          backgroundColor: user.color,
          details: val,
        }
      })
      this.events = events

      this.offDays = (await getOffDays()).data

      this.$loading.hide()
    },
    methods: {
      showDelete ({ e, event }) {
        if (!this.editMode) return
        if (event.details.userId !== this.currentUser.id) return
        event.delete(1)
        setTimeout(() => event._.deleting = false, 5000)
      },
      async createEvent ({ event, resolve }) {
        const minutesFromMidnight = date =>
          date.getHours() * 60 + date.getMinutes()
        if (minutesFromMidnight(event.start) < 540 || minutesFromMidnight(event.end) > 1200) {
          resolve()
          return
        }

        const response = (await createHours({
          userId: event.userId ? event.userId : this.currentUser.id,
          entry: DateTime.fromJSDate(event.start).toISO(),
          exit: DateTime.fromJSDate(event.end).toISO(),
        })).data
        const newEvent = {
          ...event,
          id: response.id,
          title: this.currentUser.name ?? 'Unknown User',
          backgroundColor: this.currentUser.color,
          details: {
            id: response.id,
            userId: this.currentUser.id,
          },
        }
        resolve(newEvent)
        this.events = [...this.events, newEvent]
        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.id}`,
        })
      },
      async deleteEvent (event) {
        await deleteHours(event.id)
        this.events = this.events.filter(e => e.id !== event.id)
        this.$notify({
          type: 'success',
          title: 'Entry deleted',
          text: `You have deleted entry ${event.id}`,
        })
      },
      async reloadOffDays () {
        this.offDays = (await getOffDays()).data
      },
    },
  }
</script>

<style scoped>
::v-deep(.vuecal__cell--sat), ::v-deep(.vuecal__cell--sun) {
  background-color: #f3f3f3 !important;
  pointer-events: none !important;
}
</style>
