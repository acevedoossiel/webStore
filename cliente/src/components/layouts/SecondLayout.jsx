import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarAdmin from '../shared/Navbar-admin';

const SecondLayout = ({ onLogin, handleLogout }) => {
    return (
        <div>
            <NavbarAdmin onLogin={onLogin} handleLogout={handleLogout} />
            <main>
                <Outlet /> {/* Renderiza las rutas anidadas */}
            </main>
        </div>
    );
};

export default SecondLayout;