import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Asegúrate de que Navigate esté importado
import MainLayout from './components/layouts/MainLayout';  // Asegúrate de que la ruta es correcta
import Home from './pages/Home';  // Asegúrate de que la ruta es correcta
import About from './pages/About';  // Asegúrate de que la ruta es correcta
import Role from './pages/Role';  // Asegúrate de que la ruta es correcta
import AdminRoutes from './routes/AdminRoutes';  // Asegúrate de que la ruta es correcta
import Login from './pages/admin/Login';  // Asegúrate de que la ruta es correcta
import { AuthProvider, useAuth } from './contexts/AuthContext';  // Asegúrate de que la ruta es correcta
import Cookies from 'js-cookie';  // Importa js-cookie

// Componente interno para manejar el enrutamiento
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
                        console.log('Token válido:', data);
                    } else {
                        console.log('Token inválido, redirigiendo a login...');
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
