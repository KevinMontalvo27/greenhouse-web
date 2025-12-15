export type PlantType = 'tomate' | 'maiz' | 'papa' | 'uva';

export interface Plant {
    id: number;
    name: string;
    type: PlantType;
    greenhouse_id: number;
    created_at: string;
}

export interface PlantCreate {
    name: string;
    type: PlantType;
    greenhouse_id: number;
}

export interface PlantUpdate {
    name?: string;
    type?: PlantType;
}

export interface PlantDetail extends Plant {
    analyses: PlantAnalysis[];
}

export interface PlantAnalysis {
    id: number;
    plant_id: number;
    analysis_type: string;
    result: string;
    confidence?: number;
    analyzed_at: string;
}

// Para el selector de tipo de planta
export const PLANT_TYPES: { value: PlantType; label: string }[] = [
    { value: 'tomate', label: 'Tomate' },
    { value: 'maiz', label: 'Maíz' },
    { value: 'papa', label: 'Papa' },
    { value: 'uva', label: 'Uva' },
];




