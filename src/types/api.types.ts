export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    detail: string;
    error_code?: string;
}

// Parámetros de paginación
export interface PaginationParams {
    skip?: number;
    limit?: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// Respuesta estándar de operaciones (delete, update, etc)
export interface OperationResponse {
    message: string;
    success: boolean;
}




