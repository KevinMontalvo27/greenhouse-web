// src/components/layout/Sidebar/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
    path: string;
    label: string;
    icon: string;
}

const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Usuarios', icon: '👥' },
    { path: '/greenhouses', label: 'Invernaderos', icon: '🏠' },
    { path: '/plants', label: 'Plantas', icon: '🌱' },
    { path: '/sensors', label: 'Sensores', icon: '📡' },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-64 min-h-screen bg-base-200 p-4">
        <ul className="menu">
            {menuItems.map((item) => (
            <li key={item.path}>
                <Link
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                    >
                    <span className="text-2xl">{item.icon}</span>
                    {item.label}
                </Link>
            </li>
            ))}
        </ul>
        </div>
    );
};