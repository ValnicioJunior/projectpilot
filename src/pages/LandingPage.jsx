import "../styles/LandingPage.css";
import vector from "../assets/img/Vector.png";
import CourseCard from "../components/CourseCard";
import axiosService from "../services/axiosService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.UserId;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const justLoggedIn = localStorage.getItem("justLoggedIn");

      if (justLoggedIn === "true") {
        toast.success("Tenha uma boa sessão de estudos!");
        localStorage.removeItem("justLoggedIn"); 
      }
      axiosService
        .get(`/student/${userId}/courses`)
        .then((response) => setCourses(response.data.courses || []));
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="container-landing">
      <div className="texto">
        <h3>
          Bem-vindo à sua plataforma <br /> de <span>cursos on-line</span>
        </h3>
        <img src={vector} className="homem" alt="homem sorrindo" />
      </div>
      <h2 className="h2-landing">Assista seus cursos</h2>
      <div className="card-cursos">
        {courses.length === 0 ? (
          <p>Nenhum curso encontrado.</p>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.Course.CourseId}
              title={course.Course.Title}
              description={course.Course.Description}
              image={course.Course.Image}
              onClick={() => navigate(`/curso/${course.Course.CourseId}`)}
            />
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LandingPage;
