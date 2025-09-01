import React, { useState } from 'react';
import './Login.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // states til input og loading
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // login funktion
    function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) throw new Error('Forkert brugernavn eller password');
                return res.json();
            })
            .then(data => {
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    // henter bruger info og gemmer i localStorage
                    fetch(`http://localhost:3000/api/users?email=${encodeURIComponent(username)}`)
                        .then(res => res.json())
                        .then(users => {
                            const user = Array.isArray(users) ? users[0] : users;
                            if (user && user.name && user.email) {
                                localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
                            }
                        });
                    window.dispatchEvent(new Event('loginStatusChanged'));
                }
                setUsername('');
                setPassword('');
                // loader redirect
                navigate('/minside');
            })
            .catch((err) => {
                setError('Forkert brugernavn eller password');
                // fejl
                console.error('Login fejl:', err);
            })
            .finally(() => setLoading(false));
    }

    return (
        <div id="loginPage">
            <HeaderComponent />
            <div id='breadCrumbNav'>
                <BreadcrumbNav path={['Home', 'Login']} />
            </div>
            <div id="loginContainer">
                <div id="loginContent">
                    <h2>Login</h2>
                    <p>Indtast og send username og password for at logge ind.</p>
                    <form id="loginForm" onSubmit={handleLogin}>
                        <input type="text" placeholder="Indtast dit brugernavn" value={username} onChange={e => setUsername(e.target.value)} id="loginUsername" autoComplete="username"/>
                        <input
                            type="password"
                            placeholder="Indtast dit password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            id="loginPassword"
                            autoComplete="current-password"
                        />
                        <button type="submit" id="loginBtn" disabled={loading}>
                            {loading ? 'Logger ind...' : 'Login'}
                        </button>
                        {/* fejlbesked */}
                        {error && <div id="loginError">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}