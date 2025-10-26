import "../styles/Footer.css";
import degradeImg from "../assets/img/c.svg"

const Footer = () => {
  return (
    <div className="footer-container">
      <img src={degradeImg} alt="" className="degrade-footer" />
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-site">NUTEC.CE.GOV.BR</h2>
          </div>

          <div className="footer-section">
            <p className="footer-info">
              <strong>NUTEC</strong><br />
              RUA PROF. RÔMULO PROENÇA, S/N - PICI<br />
              FORTALEZA, CE. CEP: 60.440-552
            </p>
          </div>

          <div className="footer-section">
            <p className="footer-info">
              <strong>HORÁRIO DE ATENDIMENTO</strong><br />
              DAS 08H ÀS 17H
            </p>
          </div>
          <div className="footer-section">
            <p className="footer-info">
              <strong>CONTATO</strong><br />
              WHATSAPP: (85) 9 8105-7481
            </p>
            <div className="footer-section">
              <p className="footer-info">
                © 2017 - 2025 - GOVERNO DO ESTADO DO CEARÁ<br />
                TODOS OS DIREITOS RESERVADOS
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <img src="/src/assets/img/logoNutecFundoEscuro.png" alt="Logo Nutec" className="footer-logo" />
          <img src="/src/assets/img/logoGovFundoEscuro.png" alt="Logo Governo do Estado do Ceará" className="footer-logo" />
        </div>
      </footer>
    </div>
  );
};

export default Footer;