import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Router y Route
import Home from './pages/Home';
import About from './pages/About';
import Role from './pages/Role';
import MainLayout from './components/layouts/MainLayout'; // Importa el MainLayout

function App() {
  return (
    <Router> {/* Envuelve toda la aplicación con Router */}
      <div className="App">
        {/* Define las rutas dentro de Routes */}
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} /> {/* Ruta para la página de inicio */}
          <Route path="/about" element={<MainLayout><About /></MainLayout>} /> {/* Ruta para la página About */}
          <Route path="/roles" element={<MainLayout><Role /></MainLayout>} /> {/* Ruta para la página Roles */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
