import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosService from "../services/axiosService";
import LayoutAdmin from "../components/LayoutAdmin";
import Loading from "../components/Loading";
import "../styles/ModuleMaterials.css";
import { toast, ToastContainer } from "react-toastify";

const ModuleMaterials = () => {
  const { moduleId, courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    type: "video",
    order: 1,
    duration: "",
    file: null,
  });

  const moduleData = state?.module || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchMaterials = async () => {
        setLoading(true);
        try {
          const response = await axiosService.get(
            `/course/modules/${moduleId}/materials`
          );
          setMaterials(response.data);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
          setError("Não foi possível carregar as aulas deste módulo.");
        } finally {
          setLoading(false);
        }
      };

      fetchMaterials();
    }, 500);

    return () => clearTimeout(timer);
  }, [moduleId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewMaterial((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newMaterial.title);
    formData.append("description", newMaterial.description);
    formData.append("type", newMaterial.type);
    formData.append("order", newMaterial.order);
    formData.append("duration", newMaterial.duration);
    if (newMaterial.file) formData.append("file", newMaterial.file);

    try {
      const response = await axiosService.post(
        `/course/modules/${moduleId}/materials`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Aula adicionada com sucesso!");

      setMaterials((prev) => [...prev, response.data]);
      setIsFormVisible(false);
      setNewMaterial({
        title: "",
        description: "",
        type: "video",
        order: 1,
        duration: "",
        file: null,
      });
    } catch (err) {
      console.error("Erro ao adicionar aula:", err);
      toast.error("Não foi possível adicionar a aula. Tente novamente.");
    }
  };

  const handleEditMaterial = (materialId) => {
    navigate(
      `/course/${courseId}/module/${moduleId}/material/${materialId}/edit`
    );
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm("Tem certeza que deseja remover esta aula?")) {
      try {
        await axiosService.delete(
          `/course/modules/${moduleId}/materials/${materialId}`
        );
        setMaterials(
          materials.filter((material) => material.MaterialId !== materialId)
        );
      } catch (err) {
        console.error("Erro ao remover aula:", err);
        alert("Não foi possível remover a aula. Tente novamente.");
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
      <div className="module-materials-container">
        <div className="module-header">
          <h1>{moduleData.Title || "Detalhes do Módulo"}</h1>
          {moduleData.Description && (
            <p className="module-description">{moduleData.Description}</p>
          )}
        </div>

        <div className="materials-section">
          <div className="section-header">
            <h2>{moduleData.Title || "Módulo"}</h2>
            <button
              className="add-material-btn"
              onClick={() => setIsFormVisible(true)}
            >
              + Adicionar Aula
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <Loading message="Carregando aulas..." />
            </div>
          ) : (
            <>
              {isFormVisible && (
                <div className="add-material-form">
                  <form onSubmit={handleSubmit}>
                    <h3>Nova Aula</h3>
                    <div className="form-group">
                      <label>Título</label>
                      <input
                        type="text"
                        name="title"
                        value={newMaterial.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Descrição</label>
                      <textarea
                        name="description"
                        value={newMaterial.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tipo</label>
                        <select
                          name="type"
                          value={newMaterial.type}
                          onChange={handleInputChange}
                        >
                          <option value="video">Vídeo</option>
                          <option value="pdf">PDF</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Ordem</label>
                        <input
                          type="number"
                          name="order"
                          value={newMaterial.order}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Duração (minutos)</label>
                        <input
                          type="number"
                          name="duration"
                          value={newMaterial.duration}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>Arquivo</label>
                        <input type="file" onChange={handleFileChange} />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setIsFormVisible(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn-submit">
                        Salvar Aula
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {materials.length > 0 ? (
                <div className="materials-list">
                  {materials.map((material) => (
                    <div key={material.MaterialId} className="material-item">
                      <div className="material-info">
                        <h3>{material.Title}</h3>
                        <p className="material-type">{material.Type}</p>
                        {material.Description && <p>{material.Description}</p>}
                        <div className="material-meta">
                          <span>Ordem: {material.Order}</span>
                          {material.Duration && (
                            <span>Duração: {material.Duration} min</span>
                          )}
                        </div>
                      </div>
                      <div className="material-actions">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEditMaterial(material.MaterialId)
                          }
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDeleteMaterial(material.MaterialId)
                          }
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isFormVisible && (
                  <p className="no-materials">
                    Nenhuma aula cadastrada neste módulo.
                  </p>
                )
              )}
            </>
          )}
        </div>

        <div className="footer-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            Voltar para o Módulo
          </button>
        </div>
      </div>
      <ToastContainer/>
    </LayoutAdmin>
  );
};

export default ModuleMaterials;
