import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosService from "../services/axiosService";
import Loading from "../components/Loading";
import "../styles/WatchCourse.css";
import playIcon from "../assets/img/playIcon.png";
import pauseIcon from "../assets/img/pauseIcon.png";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const WatchCourse = () => {
  const { user } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [completedMaterials, setCompletedMaterials] = useState(new Set());
  const [courseProgress, setCourseProgress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axiosService.get(`/course/${courseId}`);
        setCourse(courseRes.data);

        const modulesRes = await axiosService.get(
          `/course/${courseId}/modules`
        );
        setModules(modulesRes.data);

        const progress = await axiosService.get(
          `/student/${user.UserId}/progress/${courseId}`
        );
        setCourseProgress(progress.data.progress);

        const materialsMap = {};
        for (const mod of modulesRes.data) {
          const matsRes = await axiosService.get(
            `/course/modules/${mod.CourseModuleId}/materials`
          );
          materialsMap[mod.CourseModuleId] = matsRes.data;
        }

        setMaterials(materialsMap);

        if (
          modulesRes.data.length > 0 &&
          materialsMap[modulesRes.data[0].CourseModuleId]?.length > 0
        ) {
          setActiveMaterial(materialsMap[modulesRes.data[0].CourseModuleId][0]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!activeMaterial?.MaterialId) return;

      try {
        const res = await axiosService.get(
          `/course/comments/${activeMaterial.MaterialId}`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Erro ao buscar comentários:", err);
      }
    };

    fetchComments();
  }, [activeMaterial]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !activeMaterial?.MaterialId) return;

    try {
      await axiosService.post(`/course/comments/${activeMaterial.MaterialId}`, {
        content: newComment,
      });

      setNewComment("");

      const res = await axiosService.get(
        `/course/comments/${activeMaterial.MaterialId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!activeMaterial?.MaterialId || !user?.UserId) return;

    try {
      await axiosService.post(`/student/${user.UserId}/progress`, {
        type: "material",
        targetId: activeMaterial.MaterialId,
      });

      setCompletedMaterials((prev) =>
        new Set(prev).add(activeMaterial.MaterialId)
      );

      // Atualizar progresso após marcar aula
      const res = await axiosService.get(
        `/student/${user.UserId}/progress/${courseId}`
      );
      setCourseProgress(res.data.progress);

      toast.success("Aula marcada como concluída");
    } catch (err) {
      console.error("Erro ao marcar aula como concluída:", err);
      toast.error("Erro ao marcar como concluída.");
    }
  };

  const renderAvatar = (name) => {
    if (!name) return "??";
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials.substring(0, 2);
  };

  const renderProgressCircle = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      courseProgress !== null
        ? circumference - (courseProgress / 100) * circumference
        : circumference;

    return (
      <div className="progress-container">
        <svg width="100" height="100">
          <circle
            className="progress-bg"
            cx="50"
            cy="50"
            r={radius}
            stroke="#eee"
            strokeWidth="10"
            fill="none"
          />
          <circle
            className="progress-bar"
            cx="50"
            cy="50"
            r={radius}
            stroke="#00c853"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="progress-text"
          >
            {courseProgress ?? 0}%
          </text>
        </svg>
      </div>
    );
  };

  if (loading) return <Loading message="Carregando curso..." />;
  if (!course)
    return <p className="loading-container">Curso não encontrado.</p>;

  return (
    <div className="watch-container">
      <div className="watch-wrapper">
        <div className="video-section">
          <video
            controls
            src={activeMaterial ? activeMaterial.ContentUrl : ""}
            className="video-player"
            key={activeMaterial ? activeMaterial.MaterialId : "no-material"}
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="video-description">
            <h1>
              {activeMaterial
                ? activeMaterial.Title
                : "Nenhum material selecionado"}
            </h1>
            <p>
              {activeMaterial
                ? activeMaterial.Description
                : "Selecione uma aula na lista à direita para começar."}
            </p>
            {completedMaterials.has(activeMaterial.MaterialId) ? (
              <button className="btn-completed" disabled>
                Marcada como concluída
              </button>
            ) : (
              <button
                className="btn-mark-completed"
                onClick={handleMarkAsCompleted}
              >
                Marcar como concluída
              </button>
            )}
          </div>
          <div className="video-helpers">
            <div className="helper-buttons">
              <button
                className={activeTab === "comments" ? "active" : ""}
                onClick={() => setActiveTab("comments")}
              >
                Comentários
              </button>
              <button
                className={activeTab === "materials" ? "active" : ""}
                onClick={() => setActiveTab("materials")}
              >
                Materiais
              </button>
              <button
                className={activeTab === "assignments" ? "active" : ""}
                onClick={() => setActiveTab("assignments")}
              >
                Tarefas
              </button>
            </div>

            {activeTab === "comments" && (
              <div className="video-comments">
                <div className="add-comment">
                  <div className="avatar">
                    {renderAvatar(user?.Username || "US")}
                  </div>
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="btn-cancel"
                    onClick={() => setNewComment("")}
                  >
                    Cancelar
                  </button>
                  <button className="btn-comment" onClick={handleCommentSubmit}>
                    Comentar
                  </button>
                </div>

                <div className="comment-list">
                  {comments.length === 0 && (
                    <p style={{ color: "#888" }}>Nenhum comentário ainda.</p>
                  )}
                  {comments.map((comment) => (
                    <div key={comment.CommentId} className="comment-item">
                      <div className="avatar">
                        {renderAvatar(comment.User?.Username || "??")}
                      </div>
                      <div className="comment-content">
                        <h4>{comment.User?.Username || "Usuário"}</h4>
                        <p>{comment.Content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "materials" && (
              <div className="video-materials">
                <p>Conteúdo dos Materiais será exibido aqui.</p>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="video-assignments">
                <p>Conteúdo das Tarefas será exibido aqui.</p>
              </div>
            )}
          </div>
        </div>

        <div className="modules-section">
          <div className="course-header">
            <div className="course-title">
              <strong>
                <p>{course.Title}</p>
              </strong>
            </div>
            {renderProgressCircle()}
          </div>

          <div className="modules-list">
            {modules.map((mod) => (
              <div key={mod.CourseModuleId} className="module">
                <h3>{mod.Title}</h3>
                {materials[mod.CourseModuleId]?.length > 0 ? (
                  materials[mod.CourseModuleId].map((mat) => (
                    <div
                      key={mat.MaterialId}
                      className={`info-aula ${
                        activeMaterial?.MaterialId === mat.MaterialId
                          ? "active-lesson"
                          : ""
                      }`}
                      onClick={() => setActiveMaterial(mat)}
                    >
                      <img
                        src={
                          activeMaterial?.MaterialId === mat.MaterialId
                            ? pauseIcon
                            : playIcon
                        }
                        alt="Ícone de play/pause"
                      />
                      <div className="nome-duracao">
                        <p>{mat.Title}</p>
                        <p>{mat.Duration || "00:00"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum material disponível neste módulo.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>
          &larr; Voltar
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WatchCourse;
