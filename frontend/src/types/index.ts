export interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PatientRequest {
    name: string;
    email: string;
    phone?: string;
    birthDate?: string;
}

export interface ClinicalEvolution {
    id: string;
    description: string;
    doctorName?: string;
    geminiSummary?: string;
    createdAt: string;
}

export interface ClinicalEvolutionRequest {
    description: string;
    doctorName?: string;
}

export interface Notification {
    id: string;
    patientId: string;
    message: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pagination: Pagination;
}

export interface Pagination {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}