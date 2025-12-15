import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { UsersList } from '../pages/UsersList';
import { GreenhousesList } from '../pages/GreenhousesLIst';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/greenhouses" element={<GreenhousesList />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-error">404</h1>
                  <p className="text-2xl mt-4">Página no encontrada</p>
                  <a href="/dashboard" className="btn btn-primary mt-6">
                    Ir al Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};