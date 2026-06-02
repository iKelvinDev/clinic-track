import axios from "axios"
import type { ClinicalEvolution, ClinicalEvolutionRequest, Notification, PaginatedResponse, Patient, PatientRequest } from "../types"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

export const patientApi = {
    list: (page = 0, size = 10) =>
        api.get<PaginatedResponse<Patient>>(`/patients?page=${page}&size=${size}`),
    get: (id: string) =>
        api.get<Patient>(`/patients/${id}`),
    create: (data: PatientRequest) =>
        api.post<Patient>('/patients', data),
    update: (id: string, data: PatientRequest) =>
        api.put<Patient>(`/patients/${id}`, data),
    delete: (id: string) =>
        api.delete(`/patients/${id}`),
}

export const evolutionApi = {
    list: (patientId: string, page = 0, size = 10) =>
        api.get<PaginatedResponse<ClinicalEvolution>>(
            `/patients/${patientId}/evolutions?page=${page}&size=${size}`
        ),
        create: (patientId: string, data: ClinicalEvolutionRequest) =>
        api.post<ClinicalEvolution>(`/patients/${patientId}/evolutions`, data),
}

export const notificationApi = {
    list: (page = 0, size = 10) =>
        api.get<PaginatedResponse<Notification>>(`/notifications?page=${page}&size=${size}`),
}