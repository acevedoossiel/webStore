import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PiHandbagFill } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import styles from './Navbar.module.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const phoneNumber = "523334131768";
  const message = "Hola, quiero más información.";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarIcons}>
          <button className={styles.cartBtn} onClick={toggleMenu}>
            <LuMenu className={styles.icon} />
          </button>
        </div>

        <Link to="/" className={styles.navbarLogo}>
          <img
            src="/assets/images/banners/navbar.jpg"
            alt="Onlyvapes Logo"
            className={styles.logoImage}
          />
        </Link>

        <div className={styles.navbarIcons}>
          <button className={styles.cartBtn}>
            <PiHandbagFill className={styles.icon} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.menu}>
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
              <h1>CONTÁCTANOS:</h1>
            </li>
            <li className={styles.instagramIcon}>
              <a href="https://www.instagram.com/only.wapes?igsh=MWN3aWx6Mmo1dXZqcg==" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/insta.png" alt="Instagram" />
                <p className={styles.mediaText}>Principal</p>
              </a>
              <a href="https://www.instagram.com/onlywape.respaldo?igsh=OWMwZXMyeGw2d2Jk&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/insta.png" alt="Instagram" />
                <p className={styles.mediaText}>Respaldo</p>
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/logos/whats.png" alt="WhatsApp" />
                <p className={styles.mediaText}>WhatsApp</p>
              </a>
            </li>
          </ul>

          <button className={styles.cancelBtn} onClick={closeMenu}>
            Cancelar 
            <img
              src="/assets/images/logos/main-poto.png"
              alt="Cancelar"
              className={styles.iconLogo}
            />
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
