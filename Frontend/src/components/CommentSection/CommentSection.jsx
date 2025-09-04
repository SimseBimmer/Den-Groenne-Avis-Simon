import React, { useEffect, useState } from 'react';
import './CommentSection.scss';

// Kommentar-komponent til produkt
export default function CommentSection({ productId, sellerId }) {
  // State til kommentarer
  const [comments, setComments] = useState([]);
  // State til tekstfeltet
  const [commentText, setCommentText] = useState('');
  // State til loading og fejl
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // State til bruger
  const [user, setUser] = useState(null);

  // Hent bruger fra localStorage
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser && localUser.id) {
      setUser(localUser);
    } else {
      setUser(null);
    }
  }, []);

  // Hent kommentarer fra backend
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/comments/${productId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [productId]);

  // Send kommentar
  async function handleSendComment(e) {
    e.preventDefault();
    setError('');
    if (!commentText.trim()) {
      setError('Du skal skrive en besked');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Du skal være logget ind for at skrive en kommentar');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          comment: commentText,
          productId: productId
        })
      });
      if (!res.ok) {
        setError('Kunne ikke sende besked');
        return;
      }
      setCommentText('');
      fetch(`http://localhost:4000/api/comments/${productId}`)
        .then(res => res.json())
        .then(data => setComments(data));
    } catch {
      setError('Kunne ikke sende besked');
    }
  }

  // Slet kommentar
  async function handleDeleteComment(index) {
    const accessToken = localStorage.getItem('accessToken');
    const commentId = comments[index].id;
    try {
      const res = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        }
      });
      if (!res.ok) throw new Error();
      // Fjern kommentaren fra listen
      setComments(comments.filter((_, i) => i !== index));
    } catch {
      setError('Kunne ikke slette kommentar');
    }
  }

  // Hjælpefunktion til at formatere dato
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hour = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `d. ${day}/${month} kl. ${hour}.${min}`;
  }

  return (
    <div id="commentSectionContainer">
      <h2 id="commentSectionTitle">Kontakt sælger</h2>
      {/* Kun tekstfelt hvis man er logget ind */}
      {user ? (
        <form id="commentForm" onSubmit={handleSendComment}>
          <textarea
            id="commentTextarea"
            placeholder="Skriv en besked til sælger....."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            rows={5}
          />
          <button id="commentSendBtn" type="submit">send</button>
          {error && <div id="commentError">{error}</div>}
        </form>
      ) : (
        <div id="commentLoginBox">
          <p>Du skal være logget ind for at skrive en besked</p>
          <button id="commentLoginBtn" onClick={() => window.location.href = "/login"}>Log ind</button>
        </div>
      )}
      {/* Chatten - vises for alle */}
      <div id="commentChat">
        {loading ? (
          <div>Indlæser kommentarer...</div>
        ) : (
          comments.map((c, i) => {
            // Tjek om det er sælgeren
            const isSeller = c.user && c.user.id === sellerId;
            // Tjek om det er den aktuelle bruger
            const isOwnComment = user && c.user && c.user.id === user.id;
            return (
              <div
                key={i}
                className={isSeller ? "commentSeller" : "commentBuyer"}
              >
                <p className="commentMeta">
                  {c.user
                    ? `${c.user.firstname}${isSeller ? " (sælger)" : ""}, ${formatDate(c.createdAt)}`
                    : ""}
                </p>
                <div className="commentBox">
                  <span>{c.comment}</span>
                  {isOwnComment && (
                    <button
                      className="commentDeleteBtn"
                      onClick={() => handleDeleteComment(i)}
                    >
                      slet kommentar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


