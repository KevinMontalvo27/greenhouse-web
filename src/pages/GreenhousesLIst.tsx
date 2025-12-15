// src/pages/Greenhouses/GreenhousesList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, Button, Modal, ModalFooter, Input, Alert, Select } from '@/components/common';
import greenhousesService from '@/services/greenhouses.service';
import usersService from '@/services/users.service';
import { useAuthContext } from '@/context/AuthContext';
import type { Greenhouse, GreenhouseCreate, User } from '@/types';

export const GreenhousesList = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

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

  const loadUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar usuarios');
    }
  };

  useEffect(() => {
    loadGreenhouses();
    loadUsers();
  }, [user]);

  const handleCreate = async () => {
    if (!name) {
      setError('El nombre es requerido');
      return;
    }

    if (!selectedUserId) {
      setError('Debes seleccionar un usuario');
      return;
    }

    try {
      const newGreenhouse: GreenhouseCreate = { name, location };
      await greenhousesService.create(newGreenhouse, parseInt(selectedUserId));
      setSuccess('Invernadero creado exitosamente');
      setIsModalOpen(false);
      setName('');
      setLocation('');
      setSelectedUserId('');
      loadGreenhouses();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear invernadero');
    }
  };

  const handleViewDetail = (greenhouseId: number) => {
    navigate(`/greenhouses/${greenhouseId}`);
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'location', header: 'Ubicación' },
    {
      key: 'user_id',
      header: 'Propietario',
      render: (item: Greenhouse) => {
        const owner = users.find(u => u.id === item.user_id);
        return owner?.username || `ID: ${item.user_id}`;
      }
    },
    {
      key: 'created_at',
      header: 'Creado',
      render: (item: Greenhouse) => new Date(item.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: Greenhouse) => (
        <div className="flex gap-2">
          <Button variant="info" size="xs" onClick={() => handleViewDetail(item.id)}>
            Ver Detalle
          </Button>
          <Button variant="warning" size="xs">Editar</Button>
          <Button variant="error" size="xs">Eliminar</Button>
        </div>
      ),
    },
  ];

  const userOptions = users.map(u => ({
    value: u.id.toString(),
    label: u.username
  }));

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
            <Select
              label="Usuario Propietario"
              options={userOptions}
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="Selecciona un usuario"
            />
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};