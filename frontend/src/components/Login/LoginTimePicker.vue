<template>
  <div class="px-4">
    <v-row>
      <v-col
        cols="11"
        sm="5"
      >
        <v-menu
          ref="menu"
          v-model="menu"
          v-model:return-value="timeStart"
          :close-on-content-click="false"
          persistent
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="timeStart"
              label="Entry Hours"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              required
              :rules="[() => !!timeStart || 'This field is required']"
             
              v-bind="props"
            />
          </template>
          <v-time-picker
            v-if="menu"
            v-model="timeStart"
            :max="timeEnd"
            full-width
            format="24hr"
          >
            <v-spacer />
            <v-btn
              variant="text"
              color="success"
              @click="menu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="text"
              color="secondary"
              @click="setTimeStart"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-menu>
      </v-col>
      <v-spacer />
      <!--Exit hours menu-->
      <v-col
        cols="11"
        sm="5"
      >
        <v-menu
          ref="menu2"
          v-model="menu2"
          v-model:return-value="timeEnd"
          :close-on-content-click="false"
          persistent
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="timeEnd"
              label="Exit Hours"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              required
              :rules="[() => !!timeEnd || 'This field is required']"
             
              v-bind="props"
            />
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="timeEnd"
            :min="timeStart"
            full-width
            format="24hr"
          >
            <v-spacer />
            <v-btn
              variant="text"
              color="success"
              @click="menu2 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="text"
              color="secondary"
              @click="setTimeEnd"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-text-field
        v-model="entryNumber"
        label="Entry ticket"
        prepend-icon="mdi-ticket-confirmation"
        required
        :rules="[() => !!entryNumber || 'This field is required']"
      />
      <v-spacer />
      <v-text-field
        v-model="exitNumber"
        label="Exit ticket"
        prepend-icon="mdi-ticket-confirmation"
      />
      <v-spacer />
      <v-text-field
        v-model="safeAmount"
        label="Money in safe"
        prepend-icon="mdi-safe-square-outline"
        required
        :rules="[() => !!safeAmount || 'This field is required']"
      />
    </v-row>
  </div>
</template>

<script>
import { getLastEntry } from '@/api/hours.api';

export default {
  name: 'LoginTimePicker',
  data() {
    return {
      timeStart: null,
      timeEnd: null,
      safeAmount: null,
      entryNumber: null,
      exitNumber: null,
      menu: false,
      menu2: false,
    };
  },
  watch: {
    safeAmount() {
      this.setSafeAmount();
    },
    entryNumber() {
      this.setEntryNumber();
    },
    exitNumber() {
      this.setExitNumber()
    }
  },
  async mounted() {
    const lastEntry = (await getLastEntry()).data;

    this.entryNumber = lastEntry.exit_number;
    this.safeAmount = lastEntry.safe_amount;
  },
  methods: {
    setTimeStart() {
      this.$refs.menu.save(this.timeStart);
      this.$emit('setStart', this.timeStart);
    },
    setTimeEnd() {
      this.$refs.menu2.save(this.timeEnd);
      this.$emit('setEnd', this.timeEnd);
    },
    setSafeAmount() {
      this.$emit('setSafeAmount', this.safeAmount);
    },
    setEntryNumber() {
      this.$emit('setEntryNumber', this.entryNumber);
    },
    setExitNumber() {
      this.$emit('setExitNumber', this.exitNumber);
    }
  },
};
</script>

<style></style>
