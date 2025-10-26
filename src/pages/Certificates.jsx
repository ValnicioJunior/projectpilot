import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import certificadoBase from "../assets/CertificadoModelo/CertificadoBase.pdf";
import axiosService from "../services/axiosService";
import "/src/styles/Certificates.css";
import { toast } from "react-toastify";

const Certificados = () => {
  const { user } = useSelector((state) => state.auth);
  const [cursos, setCursos] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.UserId) return;
    carregarDados();
  }, [user]);

  const carregarDados = async () => {
    try {
      const [resCursos, resCertificados] = await Promise.all([
        axiosService.get(`/student/${user.UserId}/courses`),
        axiosService.get(`/student/${user.UserId}/certificates`),
      ]);

      const cursosRecebidos = resCursos.data.courses;
      setCursos(cursosRecebidos);

      if (cursosRecebidos.length > 0) {
        const cursoAtivo = cursosRecebidos.find(
          (c) => c.Course?.DeletedAt === null
        );
        setCursoSelecionado(cursoAtivo || null);
      }

      setCertificados(resCertificados.data.certificates || []);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
      toast.error("Erro ao carregar cursos ou certificados.");
    }
  };

  const verificarProgressoAluno = async (courseId) => {
    try {
      const response = await axiosService.get(
        `/student/${user.UserId}/progress/${courseId}`
      );
      return response.data.progress;
    } catch (erro) {
      console.error("Erro ao verificar progresso:", erro);
      toast.error("Erro ao verificar o progresso do aluno.");
      return null;
    }
  };

  const buscarDadosCertificado = async () => {
    try {
      const resCurso = await axiosService.get(
        `/course/${cursoSelecionado.CourseId}`
      );
      const curso = resCurso.data;

      return {
        nome: user?.Username || "Aluno",
        curso: curso.Title,
        instituicao: "Nutec", 
        dataInicio: new Date().toLocaleDateString("pt-BR"),
        dataFim: new Date().toLocaleDateString("pt-BR"),
        cargaHoraria: curso.Duration,
        cidade: "Fortaleza - Ceará",
        dataEmissao: new Date().toLocaleDateString("pt-BR"),
      };
    } catch (erro) {
      console.error("Erro ao buscar os dados do curso:", erro);
      toast.error("Erro ao buscar os dados do certificado.");
      return null;
    }
  };

  const gerarCertificado = async () => {
    if (!cursoSelecionado) {
      toast.warning("Selecione um curso.");
      return;
    }

    setLoading(true);

    const progresso = await verificarProgressoAluno(cursoSelecionado.CourseId);
    if (progresso === null) {
      setLoading(false);
      return;
    }

    if (progresso < 90) {
      toast.warning(
        "Você precisa completar 90% do curso para gerar o certificado."
      );
      setLoading(false);
      return;
    }

    const dados = await buscarDadosCertificado();
    if (!dados) {
      setLoading(false);
      return;
    }

    const {
      nome,
      curso,
      instituicao,
      dataInicio,
      dataFim,
      cargaHoraria,
      cidade,
      dataEmissao,
    } = dados;

    try {
      const existingPdfBytes = await fetch(certificadoBase).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPages()[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const fontSize = 14;
      let y = 320;
      const lineHeight = 22;
      const pageWidth = page.getWidth();

      const linhas = [
        {
          texto: "Certificamos para os devidos fins que",
          font,
          cor: rgb(0, 0, 0),
        },
        {
          texto: nome,
          font: fontBold,
          cor: rgb(41 / 255, 166 / 255, 50 / 255),
        },
        {
          texto: `concluiu o curso "${curso}", realizado pela ${instituicao},`,
          font,
          cor: rgb(0, 0, 0),
        },
        {
          texto: `no período de ${dataInicio} a ${dataFim}, com carga horária total de ${cargaHoraria} horas.`,
          font,
          cor: rgb(0, 0, 0),
        },
        { texto: `${cidade}, ${dataEmissao}.`, font, cor: rgb(0, 0, 0) },
      ];

      linhas.forEach((linha) => {
        const textWidth = linha.font.widthOfTextAtSize(linha.texto, fontSize);
        const x = (pageWidth - textWidth) / 2;

        page.drawText(linha.texto, {
          x,
          y,
          size: fontSize,
          font: linha.font,
          color: linha.cor,
        });

        y -= lineHeight;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "certificado.pdf";
      link.click();

      toast.success("Certificado gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      toast.error("Erro ao gerar o certificado.");
    }

    setLoading(false);
  };

  const handleCursoChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const curso = cursos.find((c) => c.CourseId === selectedId);

    if (curso?.Course?.DeletedAt) {
      toast.warning("Este curso está desativado e não pode ser selecionado.");
      return;
    }

    setCursoSelecionado(curso);
  };

  return (
    <section className="certificados">
      <h1>Área de Certificados</h1>

      <div className="bloco-certificados">
        <h2>Meus Certificados</h2>
        {certificados.length > 0 ? (
          certificados.map((cert) => (
            <div className="cert-item" key={cert.CertificateId}>
              <p>{cert.Title}</p>
              <a
                href={cert.FileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                Download
              </a>
            </div>
          ))
        ) : (
          <p>Você ainda não possui certificados gerados.</p>
        )}
      </div>

      <div className="bloco-gerar">
        <h2>Gerar Novo Certificado</h2>
        <div className="gerar-item">
          <div className="select-group">
            <label htmlFor="curso">Cursos Matriculados</label>
            <select
              id="curso"
              value={cursoSelecionado?.CourseId || ""}
              onChange={handleCursoChange}
            >
              <option value="" disabled>
                Selecione um curso
              </option>
              {cursos.map((curso) => (
                <option
                  key={curso.CourseId}
                  value={curso.CourseId}
                  disabled={curso.Course.DeletedAt !== null}
                >
                  {curso.Course.Title}{" "}
                  {curso.Course.DeletedAt ? "(Desativado)" : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-gerar"
            onClick={gerarCertificado}
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar Certificado"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Certificados;
