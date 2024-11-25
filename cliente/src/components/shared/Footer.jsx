import React from 'react';
import '../Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2024 OnlyVapes. Tienda en Huajuapan de León y Oaxaca.</p>
                <div className="footer-links">
                    <a href="/about" className="footer-link">Sobre Nosotros</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
