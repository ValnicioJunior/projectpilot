import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../redux/slices/authSlice.js';
import "/src/styles/Navbar.css";
import "/src/styles/LogoutModal.css";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const userInitials = user?.Username
        ? user.Username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "US";

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        setShowLogoutModal(false);
        navigate("/");
    };

    const handleGoToCertificates = () => {
        setShowLogoutModal(false); // Fecha o modal
        navigate("/certificados"); // Navega para a rota de certificados
    };

    // Nova função para abrir o modal para "Meu perfil"
    const handleOpenProfileModal = (e) => {
        e.preventDefault(); // Previne a navegação padrão do Link
        setShowLogoutModal(true);
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                {/*Logo à esquerda*/}
                <div className="navbar-logo">
                    <NavLink to="/home"><img src="./src/assets/img/Voce-ta-on.svg" alt="Logo" /></NavLink>
                </div>
                {/*links centralizados*/}
                <ul className="navbar-nav">
                    <li className="nav-item"><NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Página Inicial</NavLink></li>
                    <li className="nav-item"><NavLink to="/forum" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Fórum</NavLink></li>
                    <li className="nav-item"><NavLink to="/mentoria" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Mentoria</NavLink></li>
                    <li className="nav-item"><NavLink to="/contato" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contato</NavLink></li>
                    {/*Exibe link do painel para Admin*/}
                    {user?.Role === "admin" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/adm">Painel Admin</Link> {/* Ajuste o caminho se necessário */}
                        </li>
                    )}
                    {/*Exibe link da dashboardpage (perfil) para usuário comum*/}
                </ul>
                {/*Avatar a direita ou login se não estiver logado*/}
                <div>
                    {user ? (
                        <>
                            <div className="nav-avatar" onClick={() => setShowLogoutModal(true)}>
                                {userInitials}
                            </div>
                            {showLogoutModal && (
                                <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
                                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}> {/* Impede que o clique no modal feche o modal */}
                                        <p>Opções</p>
                                        <button onClick={() => { setShowLogoutModal(false); navigate("/dashboard"); }} className="certificates-button">Meu Perfil</button> {/* Adicionado o botão "Meu Perfil" */}
                                        <button onClick={handleGoToCertificates} className="certificates-button">Meus Certificados</button>
                                        <button onClick={handleLogout} className="logout-button">Logout</button>
                                        <button onClick={() => setShowLogoutModal(false)} className="cancel-button">Cancelar</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link className="nav-link" to="/">Login</Link>
                    )}
                </div>
            </nav>
            <img src="./src/assets/img/c.svg" alt="Degradê svg da navbar" className="degrade-nav" />
        </div>
    );
};

export default Navbar;