import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../components/LayoutAdmin';
import '../styles/Mentores.css';
import axios from 'axios';
import PageWrapper from '../components/PageWrapper';

const Mentores = () => {
  const [mentores, setMentores] = useState([]);

  // Buscar dados do backend
  useEffect(() => {
    const fetchMentores = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_DNS_BACK + '/mentores'); // ajuste a URL conforme seu backend
        setMentores(response.data);
      } catch (error) {
        console.error('Erro ao buscar mentores:', error);
      }
    };

    fetchMentores();
  }, []);

  // Função para excluir mentor
  const excluirMentor = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_DNS_BACK}/mentores/${id}`);
      setMentores(mentores.filter(mentor => mentor.id !== id));
    } catch (error) {
      console.error('Erro ao excluir mentor:', error);
    }
  };

  return (
    <LayoutAdmin>
      <PageWrapper>
      <div className="header-upload">
        <h1>Mentores</h1>               
      </div>

      <div className="table-container">
        <div className="table-header">
          <span>Nome</span>
          <span>E-mail</span>
          <span>Disciplina</span>
          <span>Ações</span>
        </div>

        {mentores.map((mentor) => (
          <div className="table-row" key={mentor.id}>
            <span>{mentor.nome}</span>
            <span>{mentor.email}</span>
            <span>{mentor.disciplina}</span>
            <span>
              <button onClick={() => excluirMentor(mentor.id)} className="delete-button">
                Excluir
              </button>
            </span>
          </div>
        ))}
      </div>
      </PageWrapper>
    </LayoutAdmin>
  );
};

export default Mentores;
