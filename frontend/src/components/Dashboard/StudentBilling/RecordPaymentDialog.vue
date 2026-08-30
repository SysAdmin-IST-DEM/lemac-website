<template>
  <v-dialog v-model="dialog" max-width="500">
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
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="secondary" @click="recordPayment">Record</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useNotification } from '@kyvg/vue3-notification'
  import { StudentTransactionType } from '@lemac/data-model/browser'
  import { ref, watch } from 'vue'
  import { addStudentTransaction } from '@/api/students.api.ts'
  import { useLoadingStore } from '@/stores/loading.ts'

  const loading = useLoadingStore()
  const notifications = useNotification()

  const dialog = defineModel<boolean>('modelValue')

  const props = defineProps<{
    studentId: number | null
    balance: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update', balance: number): void
  }>()

  watch(() => props.balance, () => {
    if (props.balance == null) {
      recordPaymentValue.value = 0
    } else if (props.balance < 0) {
      recordPaymentValue.value = -props.balance
    }
  })

  const recordPaymentValue = ref<number>(0)

  async function recordPayment () {
    if (props.studentId === null || props.balance === null) return
    loading.showLoadingBar()
    const response = await addStudentTransaction(StudentTransactionType.PAYMENT, recordPaymentValue.value, props.studentId)
    notifications.notify({
      type: 'success',
      title: 'Payment recorded',
      text: `Student transaction was recorded (ID: ${response.data.id})`,
    })
    loading.hideLoadingBar()

    dialog.value = false
    emit(`update`, props.balance + recordPaymentValue.value)
    recordPaymentValue.value = 0
  }
</script>

<style scoped>

</style>
