import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosService from "../services/axiosService";
import "../styles/CourseDetail.css";
import LayoutAdmin from "../components/LayoutAdmin";
import Loading from "../components/Loading";
import { toast, ToastContainer } from "react-toastify";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newModule, setNewModule] = useState({
    Title: "",
    Description: "",
    Order: 1,
  });
  const upload_url = import.meta.env.VITE_UPLOAD_URL;
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        const coursePromise = axiosService.get(`/course/${courseId}`);
        const modulesPromise = axiosService.get(`/course/${courseId}/modules`);

        try {
          const [courseResponse, modulesResponse] = await Promise.all([
            coursePromise,
            modulesPromise,
          ]);
          setCourse(courseResponse.data);
          setModules(modulesResponse.data);
        } catch (err) {
          console.error("Erro ao buscar dados do curso ou módulos:", err);
          setError("Não foi possível carregar os detalhes do curso.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({
      ...prev,
      [name]: name === "Order" ? parseInt(value) : value,
    }));
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModule.Title.trim()) {
      toast.error("É necessário adicionar texto");
      return;
    }
    try {
      const response = await axiosService.post(
        `/course/${courseId}/modules`,
        newModule
      );
      setModules((prevModules) => [...prevModules, response.data]);
      setNewModule({ Title: "", Description: "", Order: 1 });
      setIsFormVisible(false);
      toast.success("Módulo adicionado com sucesso");
    } catch (err) {
      console.error("Erro ao adicionar módulo:", err);
      alert("Não foi possível adicionar o módulo. Tente novamente.");
    }
  };

  const handleDeleteModule = async (moduleId, e) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja apagar este módulo?")) {
      try {
        await axiosService.delete(`/course/${courseId}/modules/${moduleId}`);
        setModules(
          modules.filter((module) => module.CourseModuleId !== moduleId)
        );
      } catch (err) {
        console.error("Erro ao apagar módulo:", err);
        alert("Não foi possível apagar o módulo. Tente novamente.");
      }
    }
  };

  if (error) {
    return (
      <LayoutAdmin>
        <div className="error-message">{error}</div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="page-wrapper">
        <div className="course-detail-container">
          {loading ? (
            <div className="loading-container">
              <Loading message="Carregando detalhes do curso..." />
            </div>
          ) : !course ? (
            <div className="empty-state">
              <p>Curso não encontrado.</p>
            </div>
          ) : (
            <>
              <div className="course-header">
                {course.Image && (
                  <img
                    src={upload_url + course.Image}
                    alt={`Imagem do curso ${course.Title}`}
                    className="course-image"
                    style={{ maxHeight: '200px', maxWidth: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="course-info">
                  <h1>{course.Title}</h1>
                  <p className="course-description">{course.Description}</p>
                </div>
              </div>

              <div className="course-metadata">
                <p>
                  <strong>Duração:</strong> {course.Duration}
                </p>
                <p>
                  <strong>Categoria:</strong> {course.Category}
                </p>
              </div>

              <div className="modules-section">
                <div className="modules-header">
                  <h2>Módulos do Curso</h2>
                </div>

                {modules.length > 0 ? (
                  <ul className="modules-list">
                    {modules.map((module) => (
                      <li
                        key={module.CourseModuleId}
                        className="module-item"
                        onClick={() =>
                          navigate(
                            `/adm/cursos/${courseId}/module/${module.CourseModuleId}/materials`
                          )
                        }
                      >
                        <div className="module-content">
                          <h3>{module.Title}</h3>
                          {module.Description && <p>{module.Description}</p>}
                        </div>
                        <div className="module-actions">
                          <button
                            className="btn-delete"
                            onClick={(e) =>
                              handleDeleteModule(module.CourseModuleId, e)
                            }
                          >
                            Apagar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isFormVisible && (
                    <p className="empty-modules">
                      Nenhum módulo encontrado para este curso.
                    </p>
                  )
                )}

                {isFormVisible && (
                  <div className="add-module-form-container">
                    <form onSubmit={handleAddModule}>
                      <h3>Novo Módulo</h3>
                      <div className="form-group">
                        <label htmlFor="Title">Título</label>
                        <input
                          type="text"
                          id="Title"
                          name="Title"
                          value={newModule.Title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="Description">Descrição</label>
                        <textarea
                          id="Description"
                          name="Description"
                          value={newModule.Description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="Order">Ordem</label>
                        <input
                          type="number"
                          id="Order"
                          name="Order"
                          value={newModule.Order}
                          onChange={handleInputChange}
                          required
                          min="1"
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={() => setIsFormVisible(false)}
                          className="btn-cancel"
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                          Salvar Módulo
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="header-actions">
            <button className="btn-back" onClick={() => navigate(-1)}>
              &larr; Voltar
            </button>
            {!isFormVisible && !loading && course && (
              <button
                onClick={() => setIsFormVisible(true)}
                className="add-module-btn"
              >
                Criar Módulo
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </LayoutAdmin>
  );
};

export default CourseDetail;
