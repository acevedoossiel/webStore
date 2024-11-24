import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
