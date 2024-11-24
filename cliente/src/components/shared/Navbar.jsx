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
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>
            <li>
              <Link to="/roles" onClick={closeMenu}>Roles</Link>
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
