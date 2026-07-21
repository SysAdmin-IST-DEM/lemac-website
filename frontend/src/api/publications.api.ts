import httpClient from './httpClient.api'const ENDPOINT = '/publication'export function getPublications (active = 0) {
  return httpClient.get(ENDPOINT, {    params: {      active,    },  })
}export const addPublication = (data: never) => httpClient.post(ENDPOINT, data)export const updatePublications = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data)export const deletePublications = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`)
