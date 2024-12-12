import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PiHandbagFill } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import '../Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-icons">
          <button className="cart-btn" onClick={toggleMenu}>
            <LuMenu className="icon" />
          </button>
        </div>

        <Link to="/" className="navbar-logo">
          <img
            src="/assets/images/banners/navbar.jpg"
            alt="Onlyvapes Logo"
            className="logo-image"
          />
        </Link>

        <div className="navbar-icons">
          <button className="cart-btn">
            <PiHandbagFill className="icon" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>HOME</Link>
            </li>
            <li>
              <Link to="/catalogo" onClick={closeMenu}>CATÁLOGO</Link>
            </li>
            <li>
              <Link to="/promociones" onClick={closeMenu}>PROMOCIONES</Link>
            </li>
            <li>
              <Link to="/vapes" onClick={closeMenu}>VAPES</Link>
            </li>
            <li>
              <Link to="/plumas" onClick={closeMenu}>PLUMAS</Link>
            </li>
            <li>
              <h1>CONTACTANOS:</h1>
            </li>
            <li className="instagram-icon">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/insta.png" alt="Instagram" />
                <p className="instagram-text">Principal</p>
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/insta.png" alt="Instagram" />
                <p className="instagram-text">Respaldo</p>
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/whats.png" alt="Instagram" />
                <p className="instagram-text">WhasApp</p>
              </a>
            </li>

          </ul>

          <button className="cancel-btn" onClick={closeMenu}>Cancelar <img
            src="/assets/images/logos/main-poto.png"
            alt="Cancelar"
            className="icon-logo"
          /></button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
