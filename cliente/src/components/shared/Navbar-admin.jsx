import React, { useState, lazy, Suspense } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuMenu } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from '../../contexts/AuthContext';
import '../Navbar-admin.css'; // Asegúrate de que los estilos estén definidos correctamente

// Lazy load para el diálogo de confirmación de logout
const ConfirmLogoutDialog = lazy(() => import('./ConfirmLogoutDialog'));

const NAV_ITEMS = [
    { to: "/admin", label: "PRODUCTOS" },
    { to: "/admin/promociones", label: "PROMOCIONES" },
    { to: "/admin/redes", label: "REDES" }
];

function NavbarAdmin() {
    const { isAuthenticated, logout } = useAuth();  // Usa el hook para obtener el estado de autenticación
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();

    // Maneja el estado del menú
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Cierra el menú
    const closeMenu = () => setIsMenuOpen(false);

    // Maneja el diálogo de logout
    const openLogoutDialog = () => setLogoutDialogOpen(true);
    const closeLogoutDialog = () => setLogoutDialogOpen(false);
    const confirmLogout = () => {
        logout();  // Ejecuta la función de logout del contexto
        closeLogoutDialog();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Botón del menú */}
                <button 
                    className="cart-btn" 
                    onClick={toggleMenu} 
                    aria-expanded={isMenuOpen} 
                    aria-label="Toggle Menu"
                >
                    <LuMenu className="icon" />
                </button>

                {/* Logo */}
                <NavLink to="/admin" className="navbar-logo">
                    <img
                        src="/assets/images/banners/navbar2.jpg" // Asegúrate de que esta ruta sea correcta
                        alt="Onlyvapes Logo"
                        className="logo-image"
                    />
                </NavLink>

                {/* Botón de logout solo si el usuario está autenticado */}
                {isAuthenticated && (
                    <button 
                        className="cart-btn" 
                        onClick={openLogoutDialog} 
                        aria-label="Logout"
                    >
                        <IoLogOut className="icon" />
                    </button>
                )}
            </div>

            {/* Menú desplegable */}
            {isMenuOpen && (
                <div className="menu">
                    <ul>
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                <NavLink 
                                    to={item.to}
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                    onClick={closeMenu}
                                    onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <button 
                        className="cancel-btn" 
                        onClick={closeMenu}
                        aria-label="Close Menu"
                    >
                        Cancelar 
                        <img 
                            src="/assets/images/logos/main-poto.png" 
                            alt="Cancelar" 
                            className="icon-logo"
                        />
                    </button>
                </div>
            )}

            {/* Diálogo de confirmación de logout */}
            <Suspense fallback={<div>Cargando...</div>}>
                <ConfirmLogoutDialog 
                    open={logoutDialogOpen} 
                    onClose={closeLogoutDialog} 
                    onConfirm={confirmLogout} 
                />
            </Suspense>
        </nav>
    );
}

export default NavbarAdmin;
