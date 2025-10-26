import React from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import "../styles/TopBar.css";

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userName = user?.Username || "Usuário";
  const userRole =
    user?.Role === "admin"
      ? "Administrador"
      : user?.Role === "mentor"
      ? "Mentor"
      : user?.Role === "student"
      ? "Estudante"
      : "Visitante";

  // Gera as iniciais
  const userInitials = user?.Username
    ? user.Username.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="topbar">
      <div className="perfil-container">
        <div className="perfil-iniciais">{userInitials}</div>
        <div className="perfil-info">
          <p>{userName}</p>
          <p>{userRole}</p>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
