import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice.js";
import "../styles/DashboardPage.css";
import editIcon from "../assets/img/editIcon.png";

const DashboardPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.Username || "");
      setEmail(user.Email || "");
    }
  }, [user]);

  const fileInputRef = useRef(null);

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Arquivo selecionado para upload:", file);
    }
  };

  const userInitials = user?.Username
    ? user.Username.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      Username: name,
      Email: email,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DNS_BACK}/api/users/${user.UserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar perfil.");
      }

      const data = await response.json();
      console.log("Perfil atualizado com sucesso:", data.user);

      dispatch(setUser({ user: data.user, token: token }));

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(`Erro ao atualizar perfil: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      <h1>Perfil</h1>

      <div className="dashboard-content">
        <div className="picture-container">
          <h3>Foto de Perfil</h3>
          <div className="profile-picture" onClick={handleProfilePictureClick}>
            {userInitials}
          </div>
          <img src={editIcon} alt="Editar foto de perfil" />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="dash-info-container">
          <h3>Editar Informações</h3>
          <form className="dash-form" onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Endereço de Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input type="submit" value="Salvar" />
          </form>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
