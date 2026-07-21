import type { DateTime } from 'luxon'
import httpClient from './httpClient.api'
const ENDPOINT = '/loghours'

export function getHours (month: number, year: number) {
  return httpClient.get(ENDPOINT, {
    params: {
      month,
      year,
    },
  })
}

export async function getHoursSelf () {
  return httpClient.get(`${ENDPOINT}/self`)
}

export const createHours = (data: never) => httpClient.post(ENDPOINT, data)

export const updateHours = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data)

export const deleteHours = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`)

export function getSumHours (start: DateTime, finish: DateTime) {
  return httpClient.get(`${ENDPOINT}/sum`, {
    params: {
      start: start.toFormat('yyyy-MM-dd'),
      finish: finish.toFormat('yyyy-MM-dd'),
    },
  })
}

export const getLastEntry = () => httpClient.get(`${ENDPOINT}/lastEntry`)
