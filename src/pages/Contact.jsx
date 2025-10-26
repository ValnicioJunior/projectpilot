import React, { useRef } from "react";
import "/src/styles/Contact.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("E-mail enviado com sucesso!");
    formRef.current.reset();
  };

  return (
    <section className="contact-container">
      <img src="/src/assets/img/logo-contato.svg" alt="Logo Contato" />
      <h1 className="contact-title">Contato</h1>
      <p className="contact-description">
        Entre em contato preenchendo o formulário abaixo:
      </p>

      <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
        <input type="text" placeholder="Nome" name="nome" required />
        <input type="email" placeholder="E-mail" name="email" required />
        <textarea
          id="message"
          placeholder="Descrição"
          name="mensagem"
          required
        />
        <button type="submit">Enviar</button>
      </form>

      <div className="social-media">
        <p>Nos siga nas redes sociais:</p>
        <div className="social-media-icons">
          <a
            href="https://www.nutec.ce.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/img/logo-nutec.png"
              alt="Nutec"
              className="nutec-icon"
            />
          </a>
          <a
            href="https://www.instagram.com/nutec_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/img/instagram-icon.png"
              alt="Instagram"
              className="instagram-icon"
            />
          </a>
          <a
            href="https://www.youtube.com/@NutecCe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/img/youtube-icon.png"
              alt="YouTube"
              className="youtube-icon"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/nutecce/?originalSubdomain=br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/img/linkedin-icon.png"
              alt="LinkedIn"
              className="linkedin-icon"
            />
          </a>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Contact;
