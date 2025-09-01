import React, { useEffect, useState } from 'react';
import './MinSide.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';

export default function MinSide() {
    // loader brugerens kommentarer
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // find bruger-email fra localStorage (hvis gemt)
    let userEmail = null;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) userEmail = user.email;
    } catch { }

    useEffect(() => {
        if (!userEmail) {
            setComments([]);
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3000/api/messages`)
            .then(res => res.json())
            .then(async data => {
                // Filtrer kommentarer på email
                const userMsgs = data.filter(msg => msg.email === userEmail);
                // Hent detaljer for hver kommentar
                const detailed = await Promise.all(
                    userMsgs.map(async msg =>
                        fetch(`http://localhost:3000/api/messages/${msg.id}`)
                            .then(res => res.json())
                            .catch(() => null)
                    )
                );
                // Fjern filter på productId, vis alle brugerens kommentarer
                setComments(detailed.filter(c => c && c.message));
                setLoading(false);
            })
            .catch(() => {
                setComments([]);
                setLoading(false);
            });
    }, [userEmail]);

    function handleDelete(id) {
        if (!window.confirm('Er du sikker på at du vil slette kommentaren?')) return;
        fetch(`http://localhost:3000/api/messages/${id}`, {
            method: 'DELETE'
        })
            .then(() => setComments(comments => comments.filter(c => c.id !== id)));
    }

    function handleEdit(id) {
        alert('Rediger-funktion ikke implementeret endnu.');
    }

    return (
        <div id="minSidePage">
            <HeaderComponent />
            <div id='breadCrumbNav'>
                <BreadcrumbNav path={['Home', 'Min side']} />
            </div>
            <div className="minSideContent">
                <h2>Min side</h2>
                <h3>Mine kommentarer</h3>
                <table className="commentTable">
                    <thead>
                        <tr>
                            <th>Titel</th>
                            <th>Dato</th>
                            <th>Handling</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3}>Indlæser...</td>
                            </tr>
                        ) : comments.length === 0 ? (
                            <tr>
                                <td colSpan={3}>Ingen kommentarer fundet.</td>
                            </tr>
                        ) : (
                            comments.map(comment => (
                                <tr key={comment.id}>
                                    <td>{comment.message}</td>
                                    <td>
                                        {comment.createdAt &&
                                            new Date(comment.createdAt).toLocaleDateString('da-DK', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                    </td>
                                    <td>
                                        <button className="editBtn" onClick={() => handleEdit(comment.id)}>Rediger</button>
                                        <button className="deleteBtn" onClick={() => handleDelete(comment.id)}>Slet</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}