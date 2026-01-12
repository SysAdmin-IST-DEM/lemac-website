import httpClient from './httpClient.api';
import type { DateTime } from 'luxon';
const ENDPOINT = '/room-events';

export const getEvents = (start: DateTime, finish: DateTime) =>
  httpClient.get(`${ENDPOINT}`, {
    params: {
      start: start.toISODate(),
      finish: finish.toISODate(),
    },
  });
export const createEvent = (data: never) => httpClient.post(ENDPOINT, data);
export const updateEvent = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data);
export const deleteEvent = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`);
