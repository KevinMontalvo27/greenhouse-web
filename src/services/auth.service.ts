import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { UserLogin, LoginResponse } from '../types';

class AuthService {
    // Login
    async login(credentials: UserLogin): Promise<LoginResponse> {
        try {
            console.log('🔐 Attempting login with:', { username: credentials.username });
            
            const response = await apiClient.post<LoginResponse>(
                ENDPOINTS.AUTH.LOGIN,
                credentials
            );
            
            console.log('✅ Login successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }
}

export default new AuthService();