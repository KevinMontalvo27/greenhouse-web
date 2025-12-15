import { type ReactNode } from 'react';
import { Sidebar } from './SideBar';
import { Navbar } from './NavBar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar fijo en la parte superior */}
      <Navbar />
      
      {/* Contenedor principal con Sidebar y contenido */}
      <div className="flex">
        {/* Sidebar lateral */}
        <Sidebar />
        
        {/* Contenido principal */}
        <main className="flex-1 p-6 bg-base-200 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};