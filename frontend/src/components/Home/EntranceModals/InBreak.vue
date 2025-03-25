<template>
  <v-dialog
    v-model="localEntryModal"
    max-width="400px"
    persistent
  >
    <v-card>
      <v-form
        ref="formAdd"
        class="my-4"
        @submit.prevent="save"
      >
        <v-card-text>
          <span
            v-if="getTimeDiff(userData.last_modified)"
            class="flex items-center justify-center mb-2 text-2xl font-semibold"
          >
            MAX BREAK TIME EXCEDED
          </span>
          <span class="flex items-center justify-center">
            <v-btn
              color="primary"
              class="flex flex-col items-center justify-center"
              width="320px"
              height="120px"
              theme="dark"
              @click="save"
            >
              <p class="mb-0 text-2xl">Enter LEMAC</p>
              <v-icon
                class="ml-4"
                size="large"
              >mdi-exit-to-app</v-icon>
            </v-btn>
          </span>
          <span class="flex flex-row items-center justify-center gap-4 mt-4">
            <div>
              <v-btn
                color="orange"
                class="flex flex-col items-center justify-center"
                width="152px"
                height="30px"
                theme="dark"
                @click="exit"
              >
                <p class="mb-0 text-sm">Exit LEMAC</p>
                <v-icon
                  class="ml-4"
                  size="small"
                >mdi-pause-box-outline</v-icon>
              </v-btn>
            </div>
            <div>
              <v-btn
                color="light-gray"
                class="flex flex-col items-center justify-center"
                width="152px"
                height="30px"
                theme="dark"
                @click="close"
              >
                <p class="mb-0 text-sm">Cancel</p>
                <v-icon
                  class="ml-4"
                  size="small"
                >mdi-close</v-icon>
              </v-btn>
            </div>
          </span>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { setLemacUser } from '@/api/lemacUsers.api';

export default {
  name: 'InBreak',
  props: {
    close: Function,
    entryStations: Array,
    select: Function,
    userData: Object,
    entryModal: Boolean
  },
  async mounted() {
  },
  methods: {
    async save() {
      if (!this.$refs.formAdd.validate()) return;

      const newUserData = this.userData;

      newUserData.state = "online";

      try {
        await setLemacUser(newUserData);
        this.close("");
      } catch (error) {
      }

    },
    async exit() {
      if (!this.$refs.formAdd.validate()) return;

      const newUserData = this.userData;

      newUserData.state = "offline";

      try {
        await setLemacUser(newUserData);
        this.close("close");
      } catch (error) {
      }

    },
    getTimeDiff(sqlDateString) {
      // Assuming the SQL date is stored as a string in ISO format, like "2023-05-05T13:48:35.000Z"
      const sqlDate = new Date(sqlDateString);
      const currentDate = new Date();

      // Get the timezone offset difference between the two dates in minutes
      const timezoneOffsetDiff = -currentDate.getTimezoneOffset();

      // Calculate the time difference in milliseconds, adjusted for the timezone offset difference
      const diff = Math.abs(currentDate.getTime() - sqlDate.getTime() + (timezoneOffsetDiff * 60 * 1000));

      return diff > 1*60*1000;

    }
  },
  emits: ['update:entryModal'],
  computed: {
    localEntryModal: {
      get() {
        return this.entryModal;
      },
      set(value) {
        this.$emit('update:entryModal', value);
      }
    }
  }
}
</script>
