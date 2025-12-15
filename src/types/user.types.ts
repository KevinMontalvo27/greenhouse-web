export interface User {
    id: number;
    username: string;
    created_at?: string;
}

export interface UserCreate {
    username: string;
    password: string;
}

export interface UserUpdate {
    username?: string;
    password?: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user_id: number;
    username: string;
}