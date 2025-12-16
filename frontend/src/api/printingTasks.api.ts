import httpClient from './httpClient.api';
import type { AddPrintTaskBody } from '@lemac/data-model/browser';
const ENDPOINT = '/printing';

export const addPrintTask = async (modelFile: File, data: AddPrintTaskBody) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  formData.append("modelFile", modelFile);

  return httpClient.post(ENDPOINT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
}
