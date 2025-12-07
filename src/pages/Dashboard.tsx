// src/pages/Dashboard/Dashboard.tsx
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { Card, Badge } from '../components/common';
import { useAuthContext } from '@/context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuthContext();

  const stats = [
    { title: 'Usuarios', value: '12', icon: '👥', color: 'bg-primary' },
    { title: 'Invernaderos', value: '8', icon: '🏠', color: 'bg-secondary' },
    { title: 'Plantas', value: '156', icon: '🌱', color: 'bg-accent' },
    { title: 'Sensores', value: '32', icon: '📡', color: 'bg-info' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-base-content/60 mt-2">
            Bienvenido, {user?.username}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/60 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`text-5xl ${stat.color} rounded-full w-16 h-16 flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <Card title="Actividad Reciente">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Badge variant="success">Nuevo</Badge>
              <span>Se agregó un nuevo invernadero: "Invernadero Norte"</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Badge variant="info">Actualización</Badge>
              <span>Sensor de temperatura actualizado en "Invernadero Sur"</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Badge variant="warning">Alerta</Badge>
              <span>Humedad baja detectada en Sector 3</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Acciones Rápidas">
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Agregar Usuario</button>
            <button className="btn btn-secondary">Nuevo Invernadero</button>
            <button className="btn btn-accent">Registrar Planta</button>
            <button className="btn btn-info">Configurar Sensor</button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};