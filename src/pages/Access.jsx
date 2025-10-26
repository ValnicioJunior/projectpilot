import React, { useEffect, useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import PageWrapper from "../components/PageWrapper";
import "../styles/Access.css";
import axiosService from "../services/axiosService";
import { toast, ToastContainer } from "react-toastify";

const Access = () => {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUsuariosPendentes = async () => {
      try {
        const res = await axiosService.get("/admin/user/activate");
        setPendentes(res.data.result || []);
      } catch (error) {
        console.error("Erro ao buscar usuários pendentes:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarUsuariosPendentes();
  }, []);

  const aceitarUsuario = async (id) => {
    if (!window.confirm("Deseja ativar este usuário?")) return;
    try {
      await axiosService.patch(`/admin/${id}/active`);
      toast.success("Usuário aprovado no sistema com sucesso");
      setPendentes((prev) => prev.filter((user) => user.UserId !== id));
    } catch (error) {
      console.error("Erro ao aceitar usuário:", error);
    }
  };

  const rejeitarUsuario = async (id) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;
    try {
      console.log(`/admin/user/${id}`);
      await axiosService.delete(`/admin/user/${id}`);
      toast.success("Usuário rejeitado com sucesso");
      setPendentes((prev) => prev.filter((user) => user.UserId !== id));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Não foi possível excluir esse usuário");
    }
  };

  return (
    <LayoutAdmin>
      <PageWrapper>
        <div className="header-upload">
          <h1>Permissões de Acesso</h1>
        </div>

        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Função</span>
              <span>Ações</span>
            </div>
            {pendentes.length > 0 ? (
              pendentes.map((user) => (
                <div className="table-row" key={user.UserId}>
                  <span>{user.Username || "(sem nome)"}</span>
                  <span>{user.Email || "(sem email)"}</span>
                  <span>{user.Role || "(sem função)"}</span>
                  <span className="access-buttons">
                    <button
                      className="btn-accept"
                      onClick={() => aceitarUsuario(user.UserId)}
                    >
                      Aceitar
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => rejeitarUsuario(user.UserId)}
                    >
                      Rejeitar
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhum usuário pendente.</p>
            )}
          </div>
        )}
      </PageWrapper>
      <ToastContainer />
    </LayoutAdmin>
  );
};

export default Access;
