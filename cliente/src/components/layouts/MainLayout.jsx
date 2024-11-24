import React from 'react';
import Navbar from '../shared/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
