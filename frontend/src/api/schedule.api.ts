import httpClient from './httpClient.api';
import type { MonitorSchedule } from '@lemac/data-model/browser';
const ENDPOINT = '/schedule';

export const getHours = (month: number, year: number) =>
  httpClient.get(ENDPOINT, {
    params: {
      month,
      year,
    },
  });

export const getClosestEvent = (userId: number) =>
  httpClient.get<MonitorSchedule>(`${ENDPOINT}/closest/${userId}`);

export const createHours = (data: never) => httpClient.post(ENDPOINT, data);
export const deleteHours = (id: number) => httpClient.delete(`${ENDPOINT}/${id}`);
export const updateHour = (id: number, data: never) => httpClient.put(`${ENDPOINT}/${id}`, data);
export const getUserTargets = () => httpClient.get(`${ENDPOINT}/targets`);
export const setUserTarget = (data: never) => httpClient.post(`${ENDPOINT}/targets`, data);
export const editUserTarget = (id: number, data: never) => httpClient.put(`${ENDPOINT}/targets/${id}`, data);
export const deleteUserTarget = (id: number) => httpClient.delete(`${ENDPOINT}/targets/${id}`);
export const getOffDays = () => httpClient.get(`${ENDPOINT}/off_days`);
export const setOffDays = (data: never) => httpClient.post(`${ENDPOINT}/off_days`, data);
export const deleteOffDay = (id: number) => httpClient.delete(`${ENDPOINT}/off_days/${id}`);
