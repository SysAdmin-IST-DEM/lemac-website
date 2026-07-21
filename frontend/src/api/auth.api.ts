import httpClient from './httpClient.api'

const ENDPOINT = '/auth'

export function apiLogin (code: string) {
  return httpClient.get(`${ENDPOINT}/fenix?code=${encodeURIComponent(code)}`, { skipInterceptor: true })
}

export function getFenixInfo (code: string) {
  return httpClient.get(`${ENDPOINT}/fenix_info?code=${encodeURIComponent(code)}`, {
    skipInterceptor: true,
  })
}

export async function getProfile () {
  const response = await httpClient.get(`${ENDPOINT}/profile`)
  return response.data
}
