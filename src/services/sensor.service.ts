import apiClient from './api/apiClient';
import ENDPOINTS from './api/endpoints';
import type { Sensor, SensorCreate, SensorUpdate } from '../types';

class SensorsService {
  async getByGreenhouse(
    greenhouseId: number, 
    activeOnly = false, 
    skip = 0, 
    limit = 100
  ): Promise<Sensor[]> {
    const response = await apiClient.get<Sensor[]>(
      `${ENDPOINTS.SENSORS.BASE}/greenhouse/${greenhouseId}?active_only=${activeOnly}&skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  async getById(id: number): Promise<Sensor> {
    const response = await apiClient.get<Sensor>(
      `${ENDPOINTS.SENSORS.BASE}/${id}`
    );
    return response.data;
  }

  async create(sensor: SensorCreate, userId: number): Promise<Sensor> {
    const response = await apiClient.post<Sensor>(
      `${ENDPOINTS.SENSORS.BASE}?user_id=${userId}`,
      sensor
    );
    return response.data;
  }

  async update(id: number, sensor: SensorUpdate, userId: number): Promise<Sensor> {
    const response = await apiClient.patch<Sensor>(
      `${ENDPOINTS.SENSORS.BASE}/${id}?user_id=${userId}`,
      sensor
    );
    return response.data;
  }

  async delete(id: number, userId: number): Promise<void> {
    await apiClient.delete(
      `${ENDPOINTS.SENSORS.BASE}/${id}?user_id=${userId}`
    );
  }
}

export default new SensorsService();