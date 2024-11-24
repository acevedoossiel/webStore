// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link de React Router
import { PiHandbagFill } from "react-icons/pi";
import '../Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo de la tienda */}
        <Link to="/" className="navbar-logo">
          Onlyvapes
        </Link>

        {/* Iconos para búsqueda y carrito */}
        <div className="navbar-icons">
          <button className="cart-btn">
             <PiHandbagFill />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
