import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/users', label: 'Users'},
    { path: '/devices', label: 'Device Verification'},
    { path: '/transactions', label: 'Transactions'}
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              isActive(item.path)
                ? 'bg-indigo-900 text-white'
                : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:text-white transition"
        >
          <span className="font-medium bg-red-600 px-10 py-1 rounded-md">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;