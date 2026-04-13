import httpClient from './httpClient.api';
import type { Student, StudentCard } from '@lemac/data-model/browser';
const ENDPOINT = '/students';

export const getStudents = () =>
  httpClient.get<Student[]>(ENDPOINT);

export const assignStudentCard = (studentId: number, mifareNumber: bigint) =>
  httpClient.post<StudentCard>(`${ENDPOINT}/assign-card`, {studentId, mifareNumber});