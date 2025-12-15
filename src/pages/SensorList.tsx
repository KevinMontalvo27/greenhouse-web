// src/pages/Sensors/SensorsList.tsx
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, Button, Modal, ModalFooter, Input, Alert, Select, Badge } from '@/components/common';
import sensorsService from '@/services/sensor.service';
import greenhousesService from '@/services/greenhouses.service';
import { useAuthContext } from '@/context/AuthContext';
import type { Sensor, SensorCreate, Greenhouse, SensorType } from '@/types';

export const SensorsList = () => {
  const { user } = useAuthContext();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSensorId, setCurrentSensorId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<SensorType>('temperatura');
  const [greenhouseId, setGreenhouseId] = useState('');
  const [active, setActive] = useState(true);

  const loadSensors = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Cargar sensores de todos los invernaderos del usuario
      const userGreenhouses = await greenhousesService.getByUser(user.id);
      const allSensors: Sensor[] = [];
      
      for (const greenhouse of userGreenhouses) {
        const greenhouseSensors = await sensorsService.getByGreenhouse(greenhouse.id);
        allSensors.push(...greenhouseSensors);
      }
      
      setSensors(allSensors);
    } catch (err) {
      setError('Error al cargar sensores');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGreenhouses = async () => {
    if (!user) return;
    try {
      const data = await greenhousesService.getByUser(user.id);
      setGreenhouses(data);
    } catch (err) {
      console.error('Error al cargar invernaderos');
    }
  };

  useEffect(() => {
    loadGreenhouses();
    loadSensors();
  }, [user]);

  const handleCreate = async () => {
    if (!name || !type || !greenhouseId) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const newSensor: SensorCreate = {
        name,
        type,
        greenhouse_id: parseInt(greenhouseId),
        active
      };
      await sensorsService.create(newSensor, user!.id);
      setSuccess('Sensor creado exitosamente');
      closeModal();
      loadSensors();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear sensor');
    }
  };

  const handleUpdate = async () => {
    if (!currentSensorId || !name || !type) {
      setError('Completa todos los campos');
      return;
    }

    try {
      await sensorsService.update(currentSensorId, { name, type, active }, user!.id);
      setSuccess('Sensor actualizado exitosamente');
      closeModal();
      loadSensors();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al actualizar sensor');
    }
  };

  const handleDelete = async (sensorId: number) => {
    if (!confirm('¿Estás seguro de eliminar este sensor?')) return;

    try {
      await sensorsService.delete(sensorId, user!.id);
      setSuccess('Sensor eliminado exitosamente');
      loadSensors();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar sensor');
    }
  };

  const toggleActive = async (sensor: Sensor) => {
    try {
      await sensorsService.update(sensor.id, { active: !sensor.active }, user!.id);
      setSuccess(`Sensor ${!sensor.active ? 'activado' : 'desactivado'}`);
      loadSensors();
    } catch (err: any) {
      setError('Error al cambiar estado del sensor');
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentSensorId(null);
    setName('');
    setType('temperatura');
    setGreenhouseId('');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (sensor: Sensor) => {
    setIsEditMode(true);
    setCurrentSensorId(sensor.id);
    setName(sensor.name);
    setType(sensor.type);
    setGreenhouseId(sensor.greenhouse_id.toString());
    setActive(sensor.active);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentSensorId(null);
    setName('');
    setType('temperatura');
    setGreenhouseId('');
    setActive(true);
  };

  const sensorTypeLabels: Record<SensorType, string> = {
    temperatura: 'Temperatura',
    humedad: 'Humedad',
    luz: 'Luz',
    humo: 'Humo'
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    {
      key: 'type',
      header: 'Tipo',
      render: (sensor: Sensor) => sensorTypeLabels[sensor.type]
    },
    {
      key: 'greenhouse_id',
      header: 'Invernadero',
      render: (sensor: Sensor) => {
        const greenhouse = greenhouses.find(g => g.id === sensor.greenhouse_id);
        return greenhouse?.name || `ID: ${sensor.greenhouse_id}`;
      }
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
    {
      key: 'actions',
      header: 'Acciones',
      render: (sensor: Sensor) => (
        <div className="flex gap-2">
          <Button 
            variant="info" 
            size="xs" 
            onClick={() => toggleActive(sensor)}
          >
            {sensor.active ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="warning" size="xs" onClick={() => openEditModal(sensor)}>
            Editar
          </Button>
          <Button variant="error" size="xs" onClick={() => handleDelete(sensor.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const greenhouseOptions = greenhouses.map(g => ({
    value: g.id.toString(),
    label: g.name
  }));

  const sensorTypeOptions = Object.entries(sensorTypeLabels).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Sensores</h1>
            <p className="text-base-content/60 mt-2">Gestiona tus sensores</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            + Nuevo Sensor
          </Button>
        </div>

        {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Table data={sensors} columns={columns} loading={isLoading} zebra />
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isEditMode ? 'Editar Sensor' : 'Crear Nuevo Sensor'}
          footer={
            <ModalFooter
              onConfirm={isEditMode ? handleUpdate : handleCreate}
              onCancel={closeModal}
              confirmText={isEditMode ? 'Actualizar' : 'Crear'}
            />
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Ej: Sensor Temperatura 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              label="Tipo"
              options={sensorTypeOptions}
              value={type}
              onChange={(e) => setType(e.target.value as SensorType)}
            />
            {!isEditMode && (
              <Select
                label="Invernadero"
                options={greenhouseOptions}
                value={greenhouseId}
                onChange={(e) => setGreenhouseId(e.target.value)}
                placeholder="Selecciona un invernadero"
              />
            )}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Sensor activo</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};