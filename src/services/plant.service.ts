// src/services/plants.service.ts
import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { Plant, PlantCreate, PlantUpdate } from '@/types';

class PlantsService {
  async getAll(skip = 0, limit = 100): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(
      `${ENDPOINTS.PLANTS.BASE}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  async getByGreenhouse(greenhouseId: number, skip = 0, limit = 100): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(
      `${ENDPOINTS.PLANTS.BASE}/greenhouse/${greenhouseId}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  async getById(id: number): Promise<Plant> {
    const response = await apiClient.get<Plant>(
      `${ENDPOINTS.PLANTS.BASE}/${id}`
    );
    return response.data;
  }

  async create(plant: PlantCreate, userId: number): Promise<Plant> {
    const response = await apiClient.post<Plant>(
      `${ENDPOINTS.PLANTS.BASE}?user_id=${userId}`,
      plant
    );
    return response.data;
  }

  async update(id: number, plant: PlantUpdate, userId: number): Promise<Plant> {
    const response = await apiClient.patch<Plant>(
      `${ENDPOINTS.PLANTS.BASE}/${id}?user_id=${userId}`,
      plant
    );
    return response.data;
  }

  async delete(id: number, userId: number): Promise<void> {
    await apiClient.delete(
      `${ENDPOINTS.PLANTS.BASE}/${id}?user_id=${userId}`
    );
  }

  async searchByName(name: string, skip = 0, limit = 100): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(
      `${ENDPOINTS.PLANTS.BASE}/search?name=${encodeURIComponent(name)}&skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  async getByType(type: string, skip = 0, limit = 100): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(
      `${ENDPOINTS.PLANTS.BASE}/type/${encodeURIComponent(type)}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }
}

export default new PlantsService();