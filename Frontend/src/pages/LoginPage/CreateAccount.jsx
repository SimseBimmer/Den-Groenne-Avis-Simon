import React, { useState } from 'react';
import './Login.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';
import { useNavigate } from 'react-router-dom';

export default function CreateAccount() {
    // Brugernavn, email og password fra input
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Hvis brugeren er logget ind, vis ikke denne side
    if (localStorage.getItem('accessToken')) {
        return null;
    }

    function handleCreate(e) {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password,
                image: 'user.png',
                refreshToken: '',
                isActive: true
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Kunne ikke oprette bruger, prøv igen');
                return res.json();
            })
            .then(() => {
                setName('');
                setEmail('');
                setPassword('');
                setSuccess(true);
                // Redirect til login efter 2 sekunder
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch((err) => {
                setError('Kunne ikke oprette bruger, prøv igen');
                console.error('Opret bruger fejl:', err);
            })
            .finally(() => setLoading(false));
    }

    return (
        <div id="loginPage">
            <HeaderComponent />
            <div id='breadCrumbNav'>
                <BreadcrumbNav path={['Home', 'Opret konto']} />
            </div>
            <div id="loginContainer">
                <div id="loginContent">
                    <h2>Opret konto</h2>
                    <p>Indtast navn, email og adgangskode for at oprette en konto.</p>
                    <form id="loginForm" onSubmit={handleCreate}>
                        <input type="text" placeholder="Indtast dit navn" value={name} onChange={e => setName(e.target.value)} id="createName" autoComplete="name"/>
                        <input type="email" placeholder="Indtast din email" value={email} onChange={e => setEmail(e.target.value)} id="createEmail" autoComplete="email" />
                        <input type="password" placeholder="Indtast dit password" value={password} onChange={e => setPassword(e.target.value)} id="createPassword" autoComplete="new-password" />
                        <button type="submit" id="loginBtn" disabled={loading}>
                            {loading ? 'Opretter...' : 'Opret konto'}
                        </button>
                        {error && <div id="loginError">{error}</div>}
                        {success && <div id="loginError" style={{ color: 'green' }}>Konto oprettet! Du kan nu logge ind.</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}
