import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminProductos from '../pages/admin/AdminProductos';
import AdminPromociones from '../pages/admin/AdminPromociones';
import AdminRedes from '../pages/admin/AdminRedes';
import AdminSettings from '../pages/admin/AdminSettings';
import SecondLayout from '../components/layouts/SecondLayout';

function AdminRoutes() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            <Route path="/" element={<SecondLayout />}>
                <Route path="productos" element={<AdminProductos />} />
                <Route path="promociones" element={<AdminPromociones />} />
                <Route path="redes" element={<AdminRedes />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="/" element={<Navigate to="productos" />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
