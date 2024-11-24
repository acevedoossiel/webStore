import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Role from './pages/Role';
import MainLayout from './components/layouts/MainLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/roles" element={<Role />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
