import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/Navbar'; // Navbar general
import Footer from '../shared/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* Renderiza las rutas generales */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
