import type { Student, StudentCard } from '@lemac/data-model/browser'
import httpClient from './httpClient.api'
const ENDPOINT = '/students'

export function getStudents () {
  return httpClient.get<Student[]>(ENDPOINT)
}

export function assignStudentCard (studentId: number, mifareNumber: bigint) {
  return httpClient.post<StudentCard>(`${ENDPOINT}/assign-card`, { studentId, mifareNumber })
}
