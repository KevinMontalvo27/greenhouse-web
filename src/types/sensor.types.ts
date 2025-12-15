export type SensorType = 'temperatura' | 'humedad' | 'luz' | 'humo';

export interface Sensor {
  id: number;
  name: string;
  type: SensorType;
  greenhouse_id: number;
  active: boolean;
  installed_at: string;
}

export interface SensorCreate {
  name: string;
  type: SensorType;
  greenhouse_id: number;
  active?: boolean;
}

export interface SensorUpdate {
  name?: string;
  type?: SensorType;
  active?: boolean;
}

export interface SensorDetail extends Sensor {
  readings: SensorReading[];
}

export interface SensorReading {
  id: number;
  sensor_id: number;
  value: number;
  recorded_at: string;
}

export interface SensorReadingCreate {
  sensor_id: number;
  value: number;
}

export interface SensorReadingBulkCreate {
  sensor_id: number;
  readings: number[];
}

// Para el selector de tipo de sensor
export const SENSOR_TYPES: { value: SensorType; label: string; icon: string }[] = [
  { value: 'temperatura', label: 'Temperatura', icon: '🌡️' },
  { value: 'humedad', label: 'Humedad', icon: '💧' },
  { value: 'luz', label: 'Luz', icon: '💡' },
  { value: 'humo', label: 'Humo', icon: '💨' },
];