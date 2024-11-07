import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';

const App: React.FC = () => {
  const { user } = useAuth();
console.log(user)
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
};

export default App;