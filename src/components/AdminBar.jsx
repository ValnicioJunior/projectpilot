import React from 'react';
import {NavLink} from  'react-router-dom';
import { FaTachometerAlt, FaGraduationCap, FaUsers, FaChalkboardTeacher, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import '../styles/AdminBar.css';

const AdminBar = () => {
  return (
    <div className="menu-container">
      <nav>
          <div className="title">
              <img src="/src/assets/img/logoAdmin.png" alt="Logo" />
          </div>         

          <ul className='menu-itens'>
            <li><NavLink to="/adm" activeClassName="active"><FaTachometerAlt /> Dashboard</NavLink></li>
            <li><NavLink to="/adm/cursos" activeClassName="active"><FaGraduationCap /> Upload Cursos</NavLink></li>
            <li><NavLink to="/adm/alunos" activeClassName="active"><FaUsers /> Alunos</NavLink></li>
            <li><NavLink to="/adm/mentores" activeClassName="active"><FaChalkboardTeacher /> Mentores</NavLink></li>
            <li><NavLink to="/adm/access" activeClassName="active"><FaUserShield /> Permissões</NavLink></li>
        </ul>

          <ul className='menu-sair'>
            <li><NavLink to="/login"><FaSignOutAlt /> Logout</NavLink></li>
          </ul>
        </nav>
      </div>

  );
};

export default AdminBar;
