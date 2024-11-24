import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Verifica que el elemento 'root' exista antes de intentar renderizar.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se encontró el elemento raíz 'root' en el DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Opcional: Si no utilizas `reportWebVitals`, simplemente elimínalo.
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
