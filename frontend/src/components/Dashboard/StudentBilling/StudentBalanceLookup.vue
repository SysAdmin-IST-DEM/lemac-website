<template>
  <v-container class="mt-6 bg-white">
    <v-row align="center" justify="center">
      <v-col>
        <h2 class="text-2xl text-center">Lookup Student Balance</h2>
        <h3 class="text-l text-center">Search by name or IST-ID and submit a payment</h3>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-autocomplete
          v-model="selectedStudent"
          hide-details
          :items="students
            .map(s => ({ title: `${s.name} (${s.istId})`, value: s.id, }))
            .sort((a, b) => a.title.localeCompare(b.title))"
          label="Search Student"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col>
        <h4 class="text-center">
          Current Balance: {{ currentBalance !== null ? currentBalance : '??' }}€
          <span :class="currentBalance !== null ? (currentBalance < 0 ? 'text-red' : 'text-green') : ''">
            ({{ currentBalance !== null ? (currentBalance < 0 ? 'In Debt' : 'Debt-free') : '??' }})
          </span>
        </h4>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          class="text-center"
          color="secondary"
          :disabled="selectedStudent === null"
          @click="paymentDialog = true"
        >
          Record a Payment
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <RecordPaymentDialog v-model="paymentDialog" :balance="currentBalance" :student-id="selectedStudent" @update="b => currentBalance = b" />
</template>

<script setup lang="ts">
  import type { Student } from '@lemac/data-model/browser'
  import { onMounted, ref, watch } from 'vue'
  import { getStudentBalance, getStudents } from '@/api/students.api.ts'
  import RecordPaymentDialog from '@/components/Dashboard/StudentBilling/RecordPaymentDialog.vue'
  import { useLoadingStore } from '@/stores/loading.ts'

  const loading = useLoadingStore()

  const paymentDialog = ref<boolean>(false)

  const students = ref<Student[]>([])
  const selectedStudent = ref<number | null>(null)

  onMounted(async () => {
    loading.showLoadingBar()
    students.value = (await getStudents()).data
    loading.hideLoadingBar()
  })

  const currentBalance = ref<number | null>(null)

  watch(selectedStudent, async () => {
    if (selectedStudent.value === null) {
      currentBalance.value = null
      return
    }
    loading.showLoadingBar()
    const { balance } = (await getStudentBalance(selectedStudent.value)).data
    currentBalance.value = Number(balance.toFixed(2))
    loading.hideLoadingBar()
  })
</script>

<style scoped>

</style>
