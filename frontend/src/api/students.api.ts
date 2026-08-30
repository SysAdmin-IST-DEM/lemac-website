import type { Student, StudentCard, StudentTransaction, StudentTransactionType } from '@lemac/data-model/browser'
import httpClient from './httpClient.api'
const ENDPOINT = '/students'
const ENDPOINT_BALANCE = '/student-balances'
const ENDPOINT_TRANSACTION = '/student-transaction'

export function getStudents () {
  return httpClient.get<Student[]>(ENDPOINT)
}

export function assignStudentCard (studentId: number, mifareNumber: bigint) {
  return httpClient.post<StudentCard>(`${ENDPOINT}/assign-card`, { studentId, mifareNumber })
}

export function getStudentBalance (id: number) {
  return httpClient.get<{
    studentId: number
    balance: number
  }>(`${ENDPOINT_BALANCE}/${id}`)
}

export function addStudentTransaction (type: StudentTransactionType, amount: number, studentId: number) {
  return httpClient.post<StudentTransaction>(`${ENDPOINT_TRANSACTION}`, { type, amount, studentId })
}

export function getAllStudentsBalances (debt?: boolean) {
  return httpClient.get<{ studentId: number, balance: number, student: Student }[]>(`${ENDPOINT_BALANCE}`, { params: { debt } })
}
