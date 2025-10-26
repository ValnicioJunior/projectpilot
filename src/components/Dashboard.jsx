import React from 'react';
import { FaUsers, FaChalkboardTeacher, FaVideo } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Seg', aulas: 30, tarefas: 20, acessos: 50 },
  { name: 'Ter', aulas: 40, tarefas: 25, acessos: 60 },
  { name: 'Qua', aulas: 35, tarefas: 22, acessos: 70 },
  { name: 'Qui', aulas: 50, tarefas: 30, acessos: 90 },
  { name: 'Sex', aulas: 45, tarefas: 28, acessos: 80 },
];

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      {/* Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <FaUsers className="card-icon" />
          <div>
            <h3>Total de Alunos</h3>
            <p>1200</p>
            <small>Online: 134</small>
          </div>
        </div>
        <div className="card">
          <FaChalkboardTeacher className="card-icon" />
          <div>
            <h3>Mentores</h3>
            <p>45</p>
            <small>Online: 10</small>
          </div>
        </div>
        <div className="card">
          <FaVideo className="card-icon" />
          <div>
            <h3>Aulas Enviadas</h3>
            <p>320</p>
            <small>Horas: 190</small>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="filter-buttons">
        <button>Hoje</button>
        <button>Ontem</button>
        <button>7 dias</button>
        <button>30 dias</button>
      </div>

      {/* Gráfico */}
      <div className="chart-section">
        <h2>Aulas Assistidas, Tarefas Entregues, Acesso Alunos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="aulas" stroke="#8884d8" name="Aulas Assistidas" />
            <Line type="monotone" dataKey="tarefas" stroke="#82ca9d" name="Tarefas Entregues" />
            <Line type="monotone" dataKey="acessos" stroke="#ffc658" name="Acesso Alunos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
