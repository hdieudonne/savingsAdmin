import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UsersPage from './pages/UsersPage';
import DevicesPage from './pages/DevicesPage';
import TransactionsPage from './pages/TransactionsPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  return admin ? children : <Navigate to="/login" />;
};

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  return !admin ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/devices" element={<ProtectedRoute><DevicesPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
