import React from 'react';
import '../Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2024 OnlyVapes. Todos los derechos reservados.</p>
                <div className="footer-links">
                    <a href="/about" className="footer-link">Sobre Nosotros</a>
                    <a href="/contact" className="footer-link">Contacto</a>
                    <a href="/privacy" className="footer-link">Política de Privacidad</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
