import { useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import "../styles/CourseForm.css";
import axiosService from "../services/axiosService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Duration: "",
    Category: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.Title);
      data.append("description", formData.Description);
      data.append("duration", formData.Duration);
      data.append("category", formData.Category);
      data.append("image", imageFile);

      await axiosService.post("/course", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(() => {
        toast.success("Curso adicionado com sucesso!");
      }, 500);
      navigate("/adm/cursos");
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      toast.error("Erro ao criar curso.");
    }
  };

  return (
    <LayoutAdmin>
      <div className="course-form-container">
        <h2>Criar Novo Curso</h2>
        <form onSubmit={handleSubmit} className="course-form">
          <label>Título</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            required
          />

          <label>Descrição</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            required
          />

          <label>Duração</label>
          <input
            type="text"
            name="Duration"
            value={formData.Duration}
            onChange={handleChange}
            required
          />

          <label>Categoria</label>
          <input
            type="text"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            required
          />

          <label>Imagem do Curso</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <button type="submit" className="btn-create">
            Criar Curso
          </button>
        </form>
      </div>
      <ToastContainer />
    </LayoutAdmin>
  );
};

export default CreateCourse;
