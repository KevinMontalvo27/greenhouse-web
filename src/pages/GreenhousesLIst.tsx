// src/pages/Greenhouses/GreenhousesList.tsx
import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Table, Button, Modal, ModalFooter, Input, Alert } from '../components/common';
import greenhousesService from '../services/greenhouses.service';
import { useAuthContext } from '../context/AuthContext';
import type { Greenhouse, GreenhouseCreate } from '../types';

export const GreenhousesList = () => {
  const { user } = useAuthContext();
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const loadGreenhouses = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await greenhousesService.getByUser(user.id);
      setGreenhouses(data);
    } catch (err) {
      setError('Error al cargar invernaderos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGreenhouses();
  }, [user]);

  const handleCreate = async () => {
    if (!name) {
      setError('El nombre es requerido');
      return;
    }

    try {
      const newGreenhouse: GreenhouseCreate = { name, location };
      await greenhousesService.create(newGreenhouse, user!.id);
      setSuccess('Invernadero creado exitosamente');
      setIsModalOpen(false);
      setName('');
      setLocation('');
      loadGreenhouses();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear invernadero');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'location', header: 'Ubicación' },
    {
      key: 'created_at',
      header: 'Creado',
      render: (item: Greenhouse) => new Date(item.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: () => (
        <div className="flex gap-2">
          <Button variant="info" size="xs">Ver</Button>
          <Button variant="warning" size="xs">Editar</Button>
          <Button variant="error" size="xs">Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Invernaderos</h1>
            <p className="text-base-content/60 mt-2">Gestiona tus invernaderos</p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Nuevo Invernadero
          </Button>
        </div>

        {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Table data={greenhouses} columns={columns} loading={isLoading} zebra />
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Invernadero"
          footer={
            <ModalFooter
              onConfirm={handleCreate}
              onCancel={() => setIsModalOpen(false)}
              confirmText="Crear"
            />
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Ej: Invernadero Norte"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Ubicación (opcional)"
              placeholder="Ej: Sector A, Parcela 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};