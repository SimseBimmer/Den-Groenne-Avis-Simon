import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductComments.scss";

// Komponent til kommentarer på et produkt
export default function ProductComments({ productId, sellerName, currentUser, isLoggedIn }) {
  // State til kommentarer og input
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const commentsEndRef = useRef(null);
  const navigate = useNavigate();

  // Hent kommentarer for produktet
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/comments/${productId}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [productId]);

  // Scroll til bund når kommentar tilføjes
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // Send kommentar
  function handleSend(e) {
    e.preventDefault();
    setError("");
    if (!message.trim()) return;
    setSending(true);
    fetch("http://localhost:4000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        name: currentUser?.name || "Ukendt",
        role: currentUser?.name === sellerName ? "seller" : "buyer",
        message,
        createdAt: new Date().toISOString()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Kunne ikke sende kommentar");
        return res.json();
      })
      .then(newComment => {
        setComments([...comments, newComment]);
        setMessage("");
      })
      .catch(() => setError("Kunne ikke sende kommentar"));
    setSending(false);
  }

  // Slet kommentar (kun hvis bruger ejer kommentaren)
  function handleDelete(commentId) {
    fetch(`http://localhost:4000/api/comments/${commentId}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Kunne ikke slette kommentar");
        setComments(comments.filter(c => c.id !== commentId));
      })
      .catch(() => setError("Kunne ikke slette kommentar"));
  }

  // Formater dato til "d. 22/08 kl. 15.12"
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const hour = d.getHours().toString().padStart(2, "0");
    const min = d.getMinutes().toString().padStart(2, "0");
    return `d. ${day}/${month} kl. ${hour}.${min}`;
  }

  // Opdel kommentarer i sælger og købere
  const sellerComments = comments.filter(c => c.role === "seller");
  const buyerComments = comments.filter(c => c.role !== "seller");

  return (
    <div id="productCommentsContainer">
      <h2 id="commentsTitle">Kontakt sælger</h2>
      {/* Kommentar input */}
      <form id="commentForm" onSubmit={isLoggedIn ? handleSend : (e) => { e.preventDefault(); navigate('/login'); }}>
        <textarea
          id="commentTextarea"
          placeholder="Skriv besked til sælger..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          style={{ resize: "vertical" }}
          disabled={!isLoggedIn}
          // textarea er disabled hvis ikke logget ind
        />
        {isLoggedIn ? (
          <button id="sendCommentBtn" type="submit" disabled={sending || !message.trim()}>
            {sending ? "Sender..." : "send"}
          </button>
        ) : (
          <button
            id="sendCommentBtn"
            type="button"
            style={{ background: "#eee", color: "#888", cursor: "pointer" }}
            onClick={() => navigate('/login')}
          >
            Log ind for at kommentere
          </button>
        )}
        {/* fejlbesked */}
        {error && <div id="commentError">{error}</div>}
      </form>
      {/* Kommentarer visning */}
      <div id="commentsView">
        {/* Sælgers kommentarer til venstre */}
        <div id="sellerComments">
          {sellerComments.map(comment => (
            <div key={comment.id} className="commentBox seller">
              <p className="commentMeta">
                {comment.name} (sælger): {formatDate(comment.createdAt)}
              </p>
              <div className="commentMessage">{comment.message}</div>
              {/* Slet kun hvis det er din kommentar */}
              {currentUser?.name === comment.name && (
                <span className="deleteComment" onClick={() => handleDelete(comment.id)}>
                  slet kommentar
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Køberes kommentarer til højre */}
        <div id="buyerComments">
          {buyerComments.map(comment => (
            <div key={comment.id} className="commentBox buyer">
              <p className="commentMeta">
                {comment.name}: {formatDate(comment.createdAt)}
              </p>
              <div className="commentMessage">{comment.message}</div>
              {/* Slet kun hvis det er din kommentar */}
              {currentUser?.name === comment.name && (
                <span className="deleteComment" onClick={() => handleDelete(comment.id)}>
                  slet kommentar
                </span>
              )}
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
      </div>
    </div>
  );
}
