// src/pages/Plants/PlantsList.tsx
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, Button, Modal, ModalFooter, Input, Alert, Select } from '@/components/common';
import plantsService from '@/services/plant.service';
import greenhousesService from '@/services/greenhouses.service';
import { useAuthContext } from '@/context/AuthContext';
import { type Plant, type PlantCreate, type Greenhouse, type PlantType, PLANT_TYPES } from '@/types';

export const PlantsList = () => {
  const { user } = useAuthContext();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlantId, setCurrentPlantId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<PlantType | ''>('');
  const [greenhouseId, setGreenhouseId] = useState('');

  const loadPlants = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await plantsService.getAll();
      setPlants(data);
    } catch (err) {
      setError('Error al cargar plantas');
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
    loadPlants();
    loadGreenhouses();
  }, [user]);

  const handleCreate = async () => {
    if (!name || !type || !greenhouseId) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const newPlant: PlantCreate = {
        name,
        type: type as PlantType,
        greenhouse_id: parseInt(greenhouseId)
      };
      await plantsService.create(newPlant, user!.id);
      setSuccess('Planta creada exitosamente');
      closeModal();
      loadPlants();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear planta');
    }
  };

  const handleUpdate = async () => {
    if (!currentPlantId || !name || !type) {
      setError('Completa todos los campos');
      return;
    }

    try {
      await plantsService.update(currentPlantId, { name, type }, user!.id);
      setSuccess('Planta actualizada exitosamente');
      closeModal();
      loadPlants();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al actualizar planta');
    }
  };

  const handleDelete = async (plantId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta planta?')) return;

    try {
      await plantsService.delete(plantId, user!.id);
      setSuccess('Planta eliminada exitosamente');
      loadPlants();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar planta');
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentPlantId(null);
    setName('');
    setType('');
    setGreenhouseId('');
    setIsModalOpen(true);
  };

  const openEditModal = (plant: Plant) => {
    setIsEditMode(true);
    setCurrentPlantId(plant.id);
    setName(plant.name);
    setType(plant.type);
    setGreenhouseId(plant.greenhouse_id.toString());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentPlantId(null);
    setName('');
    setType('');
    setGreenhouseId('');
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'type', header: 'Tipo' },
    {
      key: 'greenhouse_id',
      header: 'Invernadero',
      render: (plant: Plant) => {
        const greenhouse = greenhouses.find(g => g.id === plant.greenhouse_id);
        return greenhouse?.name || `ID: ${plant.greenhouse_id}`;
      }
    },
    {
      key: 'created_at',
      header: 'Creado',
      render: (plant: Plant) => new Date(plant.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (plant: Plant) => (
        <div className="flex gap-2">
          <Button variant="warning" size="xs" onClick={() => openEditModal(plant)}>
            Editar
          </Button>
          <Button variant="error" size="xs" onClick={() => handleDelete(plant.id)}>
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Plantas</h1>
            <p className="text-base-content/60 mt-2">Gestiona tus plantas</p>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            + Nueva Planta
          </Button>
        </div>

        {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Table data={plants} columns={columns} loading={isLoading} zebra />
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isEditMode ? 'Editar Planta' : 'Crear Nueva Planta'}
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
              placeholder="Ej: Tomate Cherry"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
                label="Tipo"
                options={PLANT_TYPES.map(p => ({
                    value: p.value,
                    label: p.label
                }))}
                value={type}
                onChange={(e) => setType(e.target.value as PlantType)}
                placeholder="Selecciona un tipo"
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
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};