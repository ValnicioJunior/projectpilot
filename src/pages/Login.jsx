import React, { useState } from "react";
import "../styles/Login.css";
import VoceTaOn from "../assets/img/logoVoceTaOn.png";
import LogoNutec from "../assets/img/logoNutec.png";
import LogoGov from "../assets/img/logoGov.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        import.meta.env.VITE_DNS_BACK + "/api/user/login",
        {
          Email: email,
          Password: senha,
        }
      );

      const { token, data: user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user ?? {}));
      localStorage.setItem("justLoggedIn", "true");

      dispatch(setUser({ user, token }));
      
      if (user.Role === "admin") {
        navigate("/adm");
      }
      else {
        navigate("/home");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Erro no login. Verifique suas credenciais.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="form-container">
          <div className="formulario">
            <img src={VoceTaOn} alt="Logo" className="logo-voce" />
            <h1>Bem-vindo ao Projeto...</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="emailLogin">Endereço de email</label>
              <br />
              <input
                type="email"
                placeholder="Insira seu Email"
                name="emailLogin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <label htmlFor="senhaLogin">Senha</label>
              <br />
              <input
                type="password"
                placeholder="Insira sua Senha"
                name="senhaLogin"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <br />
              <input
                type="submit"
                value="Conecte-se"
                className="login-submit"
              />
            </form>

            <div className="form-section">
              <p>
                Não possui uma conta?{" "}
                <Link to={"/signup"} className="links-form-section">
                  Registrar
                </Link>
              </p>
              <p className="ou-form">Ou</p>
              <Link className="links-form-section">Esqueceu sua senha?</Link>
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

        <div className="image-container">
          <div className="glass-container">
            <h1>Amplifique seus talentos com a Nutec</h1>
            <p>Aprenda sobre empreendedorismo com a nossa nova plataforma</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
