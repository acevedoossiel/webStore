import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Role from '../pages/Role';

const RoleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Role />} />
      <Route path="/:id" element={<h1>Detalles del Rol</h1>} />
      <Route path="/create" element={<h1>Crear Rol</h1>} />
    </Routes>
  );
};

export default RoleRoutes;
