import type { Plant } from './plant.types';
import type { Sensor } from './sensor.types';

export interface Greenhouse {
    id: number;
    name: string;
    location?: string;
    user_id: number;
    created_at: string;
}

export interface GreenhouseCreate {
    name: string;
    location?: string;
}

export interface GreenhouseUpdate {
    name?: string;
    location?: string;
}

export interface GreenhouseDetail extends Greenhouse {
    plants: Plant[];
    sensors: Sensor[];
}




