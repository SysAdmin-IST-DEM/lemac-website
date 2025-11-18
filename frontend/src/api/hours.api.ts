import httpClient from './httpClient.api';
import type { DateTime } from 'luxon';
import type { LogHour } from '@prisma/client';
const ENDPOINT = '/loghours';

export const getHours = (month: number, year: number) =>
  httpClient.get<LogHour[]>(ENDPOINT, {
    params: {
      month,
      year,
    },
  });

export async function getHoursSelf() {
  return httpClient.get<LogHour>(`${ENDPOINT}/self`);
}

export const createHours = (data: never) => httpClient.post(ENDPOINT, data);

export const updateHours = (id: number, data: never) => httpClient.put<LogHour>(`${ENDPOINT}/${id}`, data);

export const deleteHours = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`);

export const getSumHours = (start: DateTime, finish: DateTime) =>
  httpClient.get(`${ENDPOINT}/sum`, {
    params: {
      start: start.toFormat('yyyy-MM-dd'),
      finish: finish.toFormat('yyyy-MM-dd'),
    },
  });

export const getLastEntry = () => httpClient.get<LogHour>(`${ENDPOINT}/lastEntry`);
