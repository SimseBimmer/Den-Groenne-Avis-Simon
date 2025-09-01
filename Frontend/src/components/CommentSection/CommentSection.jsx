import React, { useEffect, useState, useRef } from 'react';
import './CommentSection.scss';
import CommentArrow from '../../assets/images/CommentArrow.svg';
import UserImg from '../../assets/images/image 1.png';

export default function CommentSection() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [msgSuccess, setMsgSuccess] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [open, setOpen] = useState(false);
    const textareaRef = useRef(null);

    // Hent alle beskeder (ingen filter på produkt)
    useEffect(() => {
        fetch('http://localhost:3000/api/messages')
            .then(res => res.json())
            .then(async data => {
                // Hent detaljer for alle beskeder
                const detailed = await Promise.all(
                    data.map(async msg =>
                        fetch(`http://localhost:3000/api/messages/${msg.id}`)
                            .then(res => res.json())
                            .catch(() => null)
                    )
                );
                setMessages(detailed.filter(Boolean));
            })
            .catch(() => setMessages([]));
    }, [refresh]);

    function handleCommentSubmit(e) {
        e.preventDefault();
        setMsgError('');
        setMsgSuccess('');
        setLoadingMsg(true);

        // Dummy user info
        let name = "Bruger";
        let email = "bruger@eksempel.dk";
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.name) name = user.name;
            if (user && user.email) email = user.email;
        } catch {}

        fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                message: newMessage
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Kunne ikke sende kommentar');
                return res.json();
            })
            .then(() => {
                setMsgSuccess('Kommentar sendt!');
                setNewMessage('');
                setRefresh(r => r + 1);
                setOpen(false);
            })
            .catch(() => setMsgError('Kunne ikke sende kommentar'));
        setLoadingMsg(false);
    }

    const isLoggedIn = !!localStorage.getItem('accessToken');

    function handleArrowClick() {
        setOpen(o => !o);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (newMessage.trim()) handleCommentSubmit(e);
        }
    }

    return (
        <section id="commentSection">
            <div className="commentHeaderRow">
                <h3>Kommentarer</h3>
                {isLoggedIn && (
                    <button
                        id="commentArrowBtn"
                        className={open ? 'open' : ''}
                        onClick={handleArrowClick}
                        aria-label="Skriv kommentar"
                        type="button"
                    >
                        <img src={CommentArrow} alt="Åbn kommentar" />
                    </button>
                )}
            </div>
            {isLoggedIn && (
                <form
                    id="commentForm"
                    className={open ? 'open' : ''}
                    onSubmit={handleCommentSubmit}
                    style={{ display: open ? 'flex' : 'none' }}
                >
                    <textarea
                        id="commentInput"
                        placeholder="Skriv en kommentar..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        rows={3}
                        ref={textareaRef}
                        onKeyDown={handleKeyDown}
                        required
                    />
                    <button type="submit" disabled={loadingMsg || !newMessage.trim()}>Send</button>
                    {msgError && <div className="commentError">{msgError}</div>}
                    {msgSuccess && <div className="commentSuccess">{msgSuccess}</div>}
                </form>
            )}
            {!isLoggedIn && (
                <div className="commentLoginMsg">Du skal være logget ind for at kommentere.</div>
            )}
            <ul id="commentList">
                {messages.length === 0 ? (
                    <li>Ingen kommentarer endnu.</li>
                ) : (
                    messages.map(msg => (
                        <li key={msg.id} className="commentItem">
                            <img src={UserImg} alt="Bruger" className="commentUserImg" />
                            <div>
                                <div className="commentUserName">{msg.name}</div>
                                <div className="commentText">{msg.message}</div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}