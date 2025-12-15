// src/pages/Greenhouses/GreenhouseDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, Button, Table, Alert, Badge } from '@/components/common';
import greenhousesService from '@/services/greenhouses.service';
import plantsService from '@/services/plant.service';
import sensorsService from '@/services/sensor.service';
import { useAuthContext } from '@/context/AuthContext';
import type { Greenhouse, Plant, Sensor, SensorType } from '@/types';

export const GreenhouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [greenhouse, setGreenhouse] = useState<Greenhouse | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGreenhouseData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const greenhouseData = await greenhousesService.getById(parseInt(id));
      setGreenhouse(greenhouseData);

      const plantsData = await plantsService.getByGreenhouse(parseInt(id));
      setPlants(plantsData);

      const sensorsData = await sensorsService.getByGreenhouse(parseInt(id));
      setSensors(sensorsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar datos del invernadero');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGreenhouseData();
  }, [id]);

  const sensorTypeLabels: Record<SensorType, string> = {
    temperatura: 'Temperatura',
    humedad: 'Humedad',
    luz: 'Luz',
    humo: 'Humo'
  };

  const plantColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'type', header: 'Tipo' },
    {
      key: 'created_at',
      header: 'Creado',
      render: (plant: Plant) => new Date(plant.created_at).toLocaleDateString()
    },
  ];

  const sensorColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    {
      key: 'type',
      header: 'Tipo',
      render: (sensor: Sensor) => sensorTypeLabels[sensor.type]
    },
    {
      key: 'active',
      header: 'Estado',
      render: (sensor: Sensor) => (
        <Badge variant={sensor.active ? 'success' : 'error'}>
          {sensor.active ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'installed_at',
      header: 'Instalado',
      render: (sensor: Sensor) => new Date(sensor.installed_at).toLocaleDateString()
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </MainLayout>
    );
  }

  if (error || !greenhouse) {
    return (
      <MainLayout>
        <Alert variant="error">{error || 'Invernadero no encontrado'}</Alert>
        <Button onClick={() => navigate('/greenhouses')} className="mt-4">
          Volver a Invernaderos
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">{greenhouse.name}</h1>
            <p className="text-base-content/60 mt-2">
              {greenhouse.location || 'Sin ubicación'}
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/greenhouses')}>
            ← Volver
          </Button>
        </div>

        {/* Info Card */}
        <Card title="Información General">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/60">ID</p>
              <p className="font-semibold">{greenhouse.id}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Propietario ID</p>
              <p className="font-semibold">{greenhouse.user_id}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Fecha de creación</p>
              <p className="font-semibold">
                {new Date(greenhouse.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total de plantas</p>
              <p className="font-semibold">{plants.length}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total de sensores</p>
              <p className="font-semibold">{sensors.length}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Sensores activos</p>
              <p className="font-semibold">
                {sensors.filter(s => s.active).length}
              </p>
            </div>
          </div>
        </Card>

        {/* Plantas */}
        <Card 
          title="Plantas" 
          actions={
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/plants')}
            >
              + Agregar Planta
            </Button>
          }
        >
          {plants.length > 0 ? (
            <Table data={plants} columns={plantColumns} />
          ) : (
            <p className="text-center text-base-content/60 py-8">
              No hay plantas en este invernadero
            </p>
          )}
        </Card>

        {/* Sensores */}
        <Card 
          title="Sensores"
          actions={
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/sensors')}
            >
              + Agregar Sensor
            </Button>
          }
        >
          {sensors.length > 0 ? (
            <Table data={sensors} columns={sensorColumns} />
          ) : (
            <p className="text-center text-base-content/60 py-8">
              No hay sensores en este invernadero
            </p>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};