import httpClient from './httpClient.api';
import type { DateTime } from 'luxon';
const ENDPOINT = '/loghours';

export const getHours = (month: number, year: number) =>
  httpClient.get(ENDPOINT, {
    params: {
      month,
      year,
    },
  });

export async function getHoursSelf() {
  return httpClient.get(`${ENDPOINT}/self`);
}

export const createHours = (data: never) => httpClient.post(ENDPOINT, data);

export const updateHours = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteHours = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`);

export const getSumHours = (start: DateTime, finish: DateTime) =>
  httpClient.get(`${ENDPOINT}/sum`, {
    params: {
      start: start.toFormat('yyyy-MM-dd'),
      finish: finish.toFormat('yyyy-MM-dd'),
    },
  });

export const getLastEntry = () => httpClient.get(`${ENDPOINT}/lastEntry`);
