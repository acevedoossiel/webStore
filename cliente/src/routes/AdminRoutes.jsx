import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Usa el contexto directamente
import AdminProductos from '../pages/admin/AdminProductos';
import AdminPromociones from '../pages/admin/AdminPromociones';
import AdminRedes from '../pages/admin/AdminRedes';
import AdminSettings from '../pages/admin/AdminSettings';
import SecondLayout from '../components/layouts/SecondLayout';

function AdminRoutes() {
    const { isAuthenticated } = useAuth(); // Accede al contexto directamente

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <SecondLayout>
            <Routes>
                <Route path="/admin" element={<AdminProductos />} />
                <Route path="/admin/promociones" element={<AdminPromociones />} />
                <Route path="/admin/redes" element={<AdminRedes />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
        </SecondLayout>
    );
}

export default AdminRoutes;
