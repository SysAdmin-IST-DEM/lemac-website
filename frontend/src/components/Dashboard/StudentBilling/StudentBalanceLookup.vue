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

  <v-dialog v-model="paymentDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h5">Record a Payment</v-card-title>

      <v-card-text>
        <v-number-input
          v-model="recordPaymentValue"
          :min="0"
          placeholder="Received Money"
          :precision="2"
          prefix="€"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="paymentDialog = false">Cancel</v-btn>
        <v-btn color="secondary" @click="recordPayment">Record</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useNotification } from '@kyvg/vue3-notification'
  import { type Student, StudentTransactionType } from '@lemac/data-model/browser'
  import { onMounted, ref, watch } from 'vue'
  import { addStudentTransaction, getStudentBalance, getStudents } from '@/api/students.api.ts'
  import { useLoadingStore } from '@/stores/loading.ts'

  const loading = useLoadingStore()
  const notifications = useNotification()

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
      recordPaymentValue.value = 0
      return
    }
    console.log(selectedStudent.value)
    loading.showLoadingBar()
    const { balance } = (await getStudentBalance(selectedStudent.value)).data
    currentBalance.value = Number(balance.toFixed(2))
    if (currentBalance.value < 0) recordPaymentValue.value = Math.abs(currentBalance.value)
    loading.hideLoadingBar()
  })

  const paymentDialog = ref<boolean>(false)
  const recordPaymentValue = ref<number>(0)

  async function recordPayment () {
    if (selectedStudent.value === null || currentBalance.value === null) return
    loading.showLoadingBar()
    const response = await addStudentTransaction(StudentTransactionType.PAYMENT, recordPaymentValue.value, selectedStudent.value)
    notifications.notify({
      type: 'success',
      title: 'Payment recorded',
      text: `Student transaction was recorded (ID: ${response.data.id})`,
    })
    loading.hideLoadingBar()

    paymentDialog.value = false
    currentBalance.value = currentBalance.value + recordPaymentValue.value
    recordPaymentValue.value = 0
  }
</script>

<style scoped>

</style>
