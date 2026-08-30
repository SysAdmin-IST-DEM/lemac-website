<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(debtor, index) in debtors"
        :key="index"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card class="d-flex align-center">
          <div class="flex-grow-1">
            <v-card-title>{{ getShortName(debtor.student.name) }}</v-card-title>
            <v-card-subtitle>{{ debtor.student.istId }}</v-card-subtitle>

            <v-card-text>
              <span class="text-red text-center text-xl">
                {{ Math.abs(Math.round(debtor.balance * 100) / 100) }}€
              </span>
            </v-card-text>
          </div>

          <v-card-actions class="d-flex">
            <v-icon-btn
              color="primary"
              icon="mdi-check"
              variant="outlined"
              @click="currentBalance = debtor.balance; currentStudent = debtor.studentId; recordPaymentDialog = true"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="debtors.length === 0">
      <v-col class="text-center mt-10" cols="12">
        <v-icon class="text-success mb-2" icon="mdi-check-circle-outline" size="48" />
        <p>No students are currently in debt</p>
      </v-col>
    </v-row>
  </v-container>

  <RecordPaymentDialog v-model="recordPaymentDialog" :balance="currentBalance" :student-id="currentStudent" @update="onPaymentRecord" />
</template>

<script setup lang="ts">
  import type { Student } from '@lemac/data-model/browser'
  import { onMounted, ref } from 'vue'
  import { getAllStudentsBalances } from '@/api/students.api.ts'
  import RecordPaymentDialog from '@/components/Dashboard/StudentBilling/RecordPaymentDialog.vue'

  const debtors = ref<{ studentId: number, balance: number, student: Student }[]>([])

  const recordPaymentDialog = ref<boolean>(false)
  const currentStudent = ref<number | null>(null)
  const currentBalance = ref(0)

  onMounted(async () => {
    debtors.value = (await getAllStudentsBalances(true)).data
    console.log(debtors.value)
  })

  function getShortName (name: string) {
    if (name.length < 3) return name
    const names = name.split(" ")
    return names[0] + " " + names.at(-1)
  }

  function onPaymentRecord (newBalance: number) {
    if (newBalance >= 0) {
      debtors.value = debtors.value.filter(s => s.studentId !== currentStudent.value)
    } else {
      debtors.value.find(s => s.studentId === currentStudent.value)!.balance = newBalance
    }

    currentStudent.value = null
    currentBalance.value = 0
  }
</script>

<style scoped>

</style>
