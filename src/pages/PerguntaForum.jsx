import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PerguntaForum.css';

const PerguntaForum = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  const userInitials = user?.Username
    ? user.Username.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "US";
  const userName = user.Username;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_DNS_BACK}/api/forum/${id}`)
      .then(res => setThread(res.data))
      .catch(err => console.error("Erro ao carregar pergunta:", err));

    axios.get(`${import.meta.env.VITE_DNS_BACK}/api/forum/${id}/replies`)
      .then(res => setReplies(res.data))
      .catch(err => console.error("Erro ao carregar respostas:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_DNS_BACK}/api/forum/${id}/replies`, {
        content: newReply
      });
      setNewReply("");
      const res = await axios.get(`${import.meta.env.VITE_DNS_BACK}/api/forum/${id}/replies`);
      setReplies(res.data);
    } catch (err) {
      console.error("Erro ao enviar resposta:", err);
    }
  };

  return (
    <div className="answers-container">
      {thread && (
        <>
          <div className="question-head">
            <h1>{thread.title}</h1>
            <p>Há X dias</p>
            <div className='user-info'>
              <div className="forum-avatar">{userInitials}</div>
              <p>{userName}</p>
            </div>
          </div>
          <div className="answers-content">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder='Digite sua Resposta'
                required
                className='forum-answer'
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <input type="submit" value="Enviar" className='answer-submit' />
            </form>
            <div className="answers-body">
              <h3>Respostas</h3>
              {replies.map((reply, index) => (
                <div className="answer" key={index}>
                  <div className="forum-avatar">{userInitials}</div>
                  <div className="answer-content">
                    <p className='resposta'>{reply.content}</p>
                    <p>Há Y tempo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerguntaForum;
