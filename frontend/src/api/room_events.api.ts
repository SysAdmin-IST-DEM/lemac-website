import type { DateTime } from 'luxon'
import httpClient from './httpClient.api'
const ENDPOINT = '/room-events'

export function getEvents (start: DateTime, finish: DateTime) {
  return httpClient.get(`${ENDPOINT}`, {
    params: {
      start: start.toISODate(),
      finish: finish.toISODate(),
    },
  })
}
export const createEvent = (data: never) => httpClient.post(ENDPOINT, data)
export const updateEvent = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data)
export const deleteEvent = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`)
