import { useEffect, useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import "../styles/CourseStyles.css";
import axiosService from "../services/axiosService";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { toast, ToastContainer } from "react-toastify";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      axiosService
        .get("/course")
        .then((response) => setCourses(response.data))
        .catch((error) => console.error("Erro ao buscar cursos:", error))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEditModules = (courseId) => {
    navigate(`/adm/cursos/${courseId}`);
  };

  const handleDeactivate = (courseId, e) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja desativar este curso?")) {
      axiosService
        .delete(`/course/${courseId}`)
        .then(() => {
          setCourses(courses.filter((course) => course.CourseId !== courseId));
        })
        .catch((error) => console.error("Erro ao desativar curso:", error));
      toast.success("Curso desativado com sucesso");
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-wrapper">
        <h1 className="h1-Course">Área de Cursos</h1>

        <div className="course-container">
          {loading ? (
            <Loading message="carregando cursos" />
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                className="course-item"
                key={course.CourseId}
                onClick={() => handleEditModules(course.CourseId)}
              >
                <div className="course-info">
                  <h3>{course.Title}</h3>
                  {course.Description && <p>{course.Description}</p>}
                </div>
                <div className="course-actions">
                  <button
                    className="btn-deactivate"
                    onClick={(e) => handleDeactivate(course.CourseId, e)}
                  >
                    Desativar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum curso para exibir.</p>
          )}
          <div className="header-actions">
            <button className="btn-back" onClick={() => navigate(-1)}>
              &larr; Voltar
            </button>
            <button
              className="createCourse"
              onClick={() => navigate("/adm/criar-curso")}
            >
              Criar novo curso
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </LayoutAdmin>
  );
};

export default Course;
