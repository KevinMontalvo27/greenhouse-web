import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { User, UserCreate, UserUpdate } from '../types';

class UsersService {
    async getAll(): Promise<User[]> {
        const response = await apiClient.get<User[]>(ENDPOINTS.USERS.BASE);
        return response.data;
    }

    async getById(id: number): Promise<User> {
        const response = await apiClient.get<User>(ENDPOINTS.USERS.BY_ID(id));
        return response.data;
    }

    async create(userData: UserCreate): Promise<User> {
        const response = await apiClient.post<User>(ENDPOINTS.USERS.BASE, userData);
        return response.data;
    }

    async update(id: number, userData: UserUpdate): Promise<User> {
        const response = await apiClient.patch<User>(
        ENDPOINTS.USERS.BY_ID(id),
        userData
        );
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await apiClient.delete(ENDPOINTS.USERS.BY_ID(id));
    }
}

export default new UsersService();




