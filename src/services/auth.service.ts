import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { UserLogin, LoginResponse } from '../types';

class AuthService {
    // Login
    async login(credentials: UserLogin): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        
        return response.data;
    }
}

export default new AuthService();