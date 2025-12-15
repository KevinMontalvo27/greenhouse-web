import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { Greenhouse, GreenhouseCreate, GreenhouseUpdate } from '../types';

class GreenhousesService {
  async getByUser(userId: number): Promise<Greenhouse[]> {
    const response = await apiClient.get<Greenhouse[]>(
      ENDPOINTS.GREENHOUSES.BY_USER(userId)
    );
    return response.data;
  }

  async getById(id: number): Promise<Greenhouse> {
    const response = await apiClient.get<Greenhouse>(
      ENDPOINTS.GREENHOUSES.BY_ID(id)
    );
    return response.data;
  }

  async create(greenhouseData: GreenhouseCreate, userId: number): Promise<Greenhouse> {
    const response = await apiClient.post<Greenhouse>(
      ENDPOINTS.GREENHOUSES.BASE,
      greenhouseData,
      { params: { user_id: userId } }
    );
    return response.data;
  }

  async update(id: number, greenhouseData: GreenhouseUpdate, userId: number): Promise<Greenhouse> {
    const response = await apiClient.patch<Greenhouse>(
      ENDPOINTS.GREENHOUSES.BY_ID(id),
      greenhouseData,
      { params: { user_id: userId } }
    );
    return response.data;
  }

  async delete(id: number, userId: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.GREENHOUSES.BY_ID(id), {
      params: { user_id: userId }
    });
  }
}

export default new GreenhousesService();