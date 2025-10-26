import React from 'react';
import AdminBar from './AdminBar';
import Topbar from './Topbar';
import '../styles/LayoutAdmin.css';
import { FaBars } from 'react-icons/fa';

const LayoutAdmin = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Toggle e botão */}
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-btn"><FaBars /></label>

      <AdminBar />

      <main className="center-container">
        <Topbar />
        {/* Conteúdo das páginas/admin ficará aqui */}
        {children}
      </main>
    </div>
  );
};

export default LayoutAdmin;
