import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Forum.css";
import Relogio from "../assets/img/clock-icon.png";
import Comentarios from "../assets/img/comment-icon.png";
import axios from "axios";
import {
  formatDistanceToNow,
  parseISO,
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast, ToastContainer } from "react-toastify";

const formatTimeAgo = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (minutes < 60) {
    return `há ${minutes} minuto${minutes === 1 ? "" : "s"}`;
  } else if (hours < 24) {
    return `há ${hours} hora${hours === 1 ? "" : "s"}`;
  } else if (days < 30) {
    return `há ${days} dia${days === 1 ? "" : "s"}`;
  } else {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  }
};

const Forum = () => {
  const { user } = useSelector((state) => state.auth);
  const [threads, setThreads] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  const userInitials = user?.Username
    ? user.Username.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  const userName = user.Username;

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(import.meta.env.VITE_DNS_BACK + "/api/forum", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setThreads(res.data.threads))
      .catch((err) => console.error("Erro ao carregar tópicos:", err));
  }, []);

  const handleSubmit = async (e) => {
    toast.success("Tópico adicionado ao fórum com sucesso");
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        import.meta.env.VITE_DNS_BACK + "/api/forum",
        {
          title: newQuestion,
          content: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewQuestion("");
      const res = await axios.get(
        import.meta.env.VITE_DNS_BACK + "/api/forum",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setThreads(res.data.threads);
    } catch (err) {
      console.error("Erro ao criar tópico:", err);
    }
  };

  return (
    <div className="forum-container">
      <div className="forum-title">
        <h1>Fórum</h1>
      </div>
      <div className="forum-content">
        <form onSubmit={handleSubmit} className="form-forum">
          <input
            type="text"
            placeholder="Digite sua Pergunta"
            required
            className="forum-question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <input type="submit" value="Enviar" className="forum-submit" />
        </form>

        <div className="forum-questions">
          {threads.map((thread) => (
            <Link
              to={`/forum/${thread.ThreadId}`}
              className="question-card"
              key={thread.ThreadId}
            >
              <div className="user-info">
                <div className="forum-avatar">{userInitials}</div>
                <p>{userName}</p>
              </div>
              <div className="card-question">{thread.Title}</div>
              <div className="question-data">
                <div className="tempo">
                  <img src={Relogio} alt="Ícone de relógio" />
                  {thread.CreatedAt && <p>{formatTimeAgo(thread.CreatedAt)}</p>}
                </div>
                <div className="respostas">
                  <img src={Comentarios} alt="Ícone de comentários" />
                  <p>
                    {thread._count.Replies}{" "}
                    {thread._count.Replies === 1 ? "resposta" : "respostas"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Forum;
