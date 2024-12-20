import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Role from './pages/Role';
import AdminRoutes from './routes/AdminRoutes';
import Login from './pages/admin/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Cookies from 'js-cookie';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/validateToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authToken: token }),
          });

          if (response.ok) {
            const data = await response.json();
          } else {
            Cookies.remove('authToken');
          }
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="roles" element={<Role />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminRoutes /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
