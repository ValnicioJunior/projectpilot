import React, { useEffect, useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import "../styles/Alunos.css";
import axiosService from "../services/axiosService";
import PageWrapper from "../components/PageWrapper";
import Loading from "../components/Loading";

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [cursosMatriculados, setCursosMatriculados] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      axiosService
        .get("/admin/user/role/student")
        .then((res) => setAlunos(res.data))
        .catch((err) => console.error("Erro ao buscar alunos:", err))
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const handleDesativarAluno = async (userId) => {
    if (!window.confirm("Tem certeza que deseja desativar este aluno?")) return;
    try {
      await axiosService.patch(`/admin/${userId}/active`);
      setAlunos((prevAlunos) =>
        prevAlunos.map((aluno) =>
          aluno.UserId === userId ? { ...aluno, Active: !aluno.Active } : aluno
        )
      );
    } catch (error) {
      console.error("Erro ao desativar aluno:", error);
    }
  };

  const abrirModalMatricula = async (aluno) => {
    setSelectedAluno(aluno);
    setModalOpen(true);
    setCursoSelecionado("");
    try {
      const [resCursos, resMatriculados] = await Promise.all([
        axiosService.get("/course"),
        axiosService.get(`/student/${aluno.UserId}/courses`),
      ]);
      setCursos(resCursos.data);
      setCursosMatriculados(resMatriculados.data.courses);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  const vincularAluno = async () => {
    if (!cursoSelecionado) {
      alert("Selecione um curso.");
      return;
    }
    try {
      await axiosService.post(`/admin/enrollStudent/${selectedAluno.UserId}`, {
        courseId: parseInt(cursoSelecionado),
      });
      alert("Aluno matriculado com sucesso!");
      setModalOpen(false);
      setCursoSelecionado("");
    } catch (error) {
      console.error("Erro ao matricular aluno:", error);
      alert("Erro ao matricular aluno");
    }
  };

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.Username.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <LayoutAdmin>
      <PageWrapper>
        <div className="header-upload">
          <h1>Alunos</h1>
        </div>

        <div className="content-search">
          <input
            type="text"
            placeholder="Pesquisar alunos..."
            value={busca}
            onChange={handleBuscaChange}
          />
        </div>

        {loading ? (
          <Loading message="carregando alunos..." />
        ) : (
          <div className="table-container">
            {alunosFiltrados.map((aluno) => (
              <div className="aluno-card" key={aluno.UserId}>
                <div className="aluno-info">
                  <span>
                    <strong>Nome:</strong> {aluno.Username}
                  </span>
                  <span>
                    <strong>Email:</strong> {aluno.Email}
                  </span>
                  <span className="status">
                    <strong>Status:</strong>{" "}
                    {aluno.Active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="aluno-actions">
                  <button
                    className="btn-upload1"
                    onClick={() => abrirModalMatricula(aluno)}
                  >
                    Gerenciar Matrículas
                  </button>
                  <button
                    className="btn-upload1"
                    onClick={() => handleDesativarAluno(aluno.UserId)}
                  >
                    {aluno.Active ? "Desativar Usuário" : "Ativar Usuário"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Matrícula de {selectedAluno?.Username}</h2>
              {cursosMatriculados.length > 0 && (
                <div className="matriculados-box">
                  <h3>Cursos Matriculados</h3>
                  <ul>
                    {cursosMatriculados.map((item) => (
                      <li key={item.EnrollmentId}>
                        <strong>{item.Course.Title}</strong> –{" "}
                        {item.Course.Duration}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <select
                value={cursoSelecionado}
                onChange={(e) => setCursoSelecionado(e.target.value)}
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.CourseId} value={curso.CourseId}>
                    {curso.Title}
                  </option>
                ))}
              </select>
              <div className="modal-buttons">
                <button className="btn-upload1" onClick={vincularAluno}>
                  Vincular Aluno
                </button>
                <button
                  className="btn-upload1"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </LayoutAdmin>
  );
};

export default Alunos;
