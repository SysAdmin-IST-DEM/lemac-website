import httpClient from './httpClient.api'
const ENDPOINT = '/room-hours'

export const getHoursFenix = (data: never) => httpClient.post(`${ENDPOINT}/fenix`, data)
export function getHours (month: number, year: number) {
  return httpClient.get(`${ENDPOINT}`, {
    params: {
      month,
      year,
    },
  })
}
export const createHours = (data: never) => httpClient.post(ENDPOINT, data)
export const deleteHours = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`)
export const updateHours = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data)
