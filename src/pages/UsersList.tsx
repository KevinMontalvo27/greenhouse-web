// src/pages/Users/UsersList.tsx
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { Table, Button, Modal, ModalFooter, Input, Alert, Badge } from '@/components/common';
import usersService from '@/services/users.service';
import type { User, UserCreate } from '@/types';

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!username || !password) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const newUser: UserCreate = { username, password };
      await usersService.create(newUser);
      setSuccess('Usuario creado exitosamente');
      setIsModalOpen(false);
      setUsername('');
      setPassword('');
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear usuario');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: 'Usuario' },
    {
      key: 'created_at',
      header: 'Creado',
      render: (user: User) => user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (user: User) => (
        <div className="flex gap-2">
          <Button variant="info" size="xs">Editar</Button>
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
            <h1 className="text-4xl font-bold">Usuarios</h1>
            <p className="text-base-content/60 mt-2">Gestiona los usuarios del sistema</p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Nuevo Usuario
          </Button>
        </div>

        {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Table data={users} columns={columns} loading={isLoading} zebra />
          </div>
        </div>

        {/* Modal Crear Usuario */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Usuario"
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
              label="Usuario"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};