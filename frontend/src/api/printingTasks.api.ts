import type {
  AddPrintTaskBody,
  EditPrintTaskBody,
  PrintTask,
} from '@lemac/data-model/browser'
import httpClient from './httpClient.api'
const ENDPOINT = '/printing'

export async function addPrintTask (modelFile: File, data: AddPrintTaskBody) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, String(value))
  }

  formData.append("modelFile", modelFile)

  return httpClient.post(ENDPOINT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export function getPrintTasks () {
  return httpClient.get<PrintTask[]>(ENDPOINT)
}

export const updatePrintingTask = (id: number, data: EditPrintTaskBody) => httpClient.put<PrintTask>(`${ENDPOINT}/${id}`, data)
