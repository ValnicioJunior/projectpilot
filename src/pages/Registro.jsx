import React from "react";
import "../styles/Registro.css";
import { useNavigate } from "react-router-dom";
import VoceTaOn from "../assets/img/logoVoceTaOn.png";
import LogoNutec from "../assets/img/logoNutec.png";
import LogoGov from "../assets/img/logoGov.png";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import { useState } from "react";
import axios from "axios";

const Registro = () => {
  const [form, setForm] = useState({
    nomeRegistro: "",
    emailRegistro: "",
    senhaRegistro: "",
    confirmaSenha: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senhaRegistro !== form.confirmaSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_DNS_BACK + "/api/user/register", {
        Username: form.nomeRegistro,
        Email: form.emailRegistro,
        Password: form.senhaRegistro,
        Role: form.role,
      });

      toast.success(
        "Registro bem-sucedido! Aguarde um administrador aprovar seu cadastro"
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error(error.response.data || error);
      toast.error("Erro no registro");
    }
  };

  return (
    <>
      <div className="registro-container">
        <div className="image-container-registro">
          <div className="glass-container">
            <h1>Amplifique seus talentos com a Nutec</h1>
            <p>Aprenda sobre empreendedorismo com a nossa nova plataforma</p>
          </div>
        </div>

        <div className="form-container">
          <div className="formulario">
            <img src={VoceTaOn} alt="Logo" className="logo-voce" />
            <h1>Seja bem-vindo!</h1>
            <p>Adicione suas informações de registro</p>
            <form onSubmit={handleSubmit} name="registroForm">
              <label htmlFor="nomeRegistro">Nome</label>
              <br />
              <input
                type="text"
                placeholder="Ex: João Silva"
                name="nomeRegistro"
                value={form.nomeRegistro}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="emailRegistro">Endereço de email</label>
              <br />
              <input
                type="email"
                placeholder="Insira seu Email"
                name="emailRegistro"
                value={form.emailRegistro}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="senhaRegistro">Senha</label>
              <br />
              <input
                type="password"
                placeholder="Insira sua Senha"
                name="senhaRegistro"
                value={form.senhaRegistro}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="confirmaSenha">Confirme sua Senha</label>
              <br />
              <input
                type="password"
                placeholder="Insira sua Senha novamente"
                name="confirmaSenha"
                value={form.confirmaSenha}
                onChange={handleChange}
                required
              />
              <br />
              <label for="roles">Escolha seu cargo</label>
              <br />
              <select
                name="role"
                id="role"
                form="registroForm"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="estudante">Estudante</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Administrador</option>
              </select>
              <br />
              <input
                type="submit"
                value="Registre-se"
                className="registro-submit"
              />
            </form>

            <div className="form-section">
              <p>
                Já possui uma conta?{" "}
                <Link to={"/"} className="links-form-section">
                  Login
                </Link>
              </p>
            </div>
          </div>
          <div className="logos-bottom">
            <img src={LogoNutec} alt="Logo da Nutec" className="logo-nutec" />
            <img
              src={LogoGov}
              alt="Logo do Governo do Estado do Ceará"
              className="logo-gov"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Registro;
