import React, { useState } from 'react';
import './Login.scss';
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from '../../components/Footer/FooterComponent.jsx';
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import bannerImg2 from "../../assets/images/bannerImages/banner_image2.jpg";
import bannerImg3 from "../../assets/images/bannerImages/banner_image3.jpg";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    // State til login-form felter og beskeder
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Tjek om bruger er logget ind (bruges til at disable knap og vise besked)
    const isLoggedIn = !!localStorage.getItem('accessToken');

    // Funktion til at håndtere login
    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Simpel validering af felter
        if (!loginEmail || !loginPassword) {
            setError('Alle felter skal udfyldes');
            return;
        }

        setLoading(true);
        try {
            // Kalder backend login endpoint
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginEmail, password: loginPassword })
            });
            if (!res.ok) throw new Error('Forkert brugernavn eller password');
            const data = await res.json();
            if (data.accessToken) {
                // Gem token og bruger i localStorage (så man forbliver logget ind)
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify({ name: data.user.name, email: loginEmail }));
                setSuccess('Du er nu logget ind!');
                setLoginEmail('');
                setLoginPassword('');
                // Vent 1.5 sekunder og send bruger til forsiden
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        } catch (err) {
            // Hvis login fejler (forkert brugernavn eller password)
            setError('Forkert brugernavn eller password');
        }
        setLoading(false);
    }

    return (
        <div id='loginPageContainer'>
            <main id='loginPage'>
                <HeaderComponent />
                <GreenDivider />
                <div id='loginFormContainer'>
                    <h2>Velkommen tilbage</h2>
                    {/* Error banner synligt over formen */}
                    {error && (
                        <div id="loginErrorBanner">
                            {/* Viser fejlbesked hvis noget mangler eller er forkert */}
                            {error}
                        </div>
                    )}
                    {/* Success banner synligt over formen */}
                    {success && (
                        <div id="loginSuccessBanner">
                            {/* Viser succesbesked når login lykkes */}
                            {success}
                        </div>
                    )}
                    {/* Login form */}
                    <form onSubmit={handleLogin}>
                        {/* Email input */}
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            required
                        />
                        {/* Password input */}
                        <label htmlFor="password">Adgangskode</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Adgangskode"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                            required
                        />
                        {/* Link til signup side */}
                        <p>
                            Har du ikke allerede en konto? klik <Link to="/signup">her</Link> for at gå til sign up
                        </p>
                        {/* Login knap */}
                        <button type="submit" disabled={loading || isLoggedIn}>
                            {loading ? 'Logger ind...' : 'Login'}
                        </button>
                        {/* Hvis allerede logget ind, vis besked */}
                        {isLoggedIn && <div id="loginSuccess">Du er allerede logget ind.</div>}
                    </form>
                </div>
                <GreenDivider />
                {/* Donation-sektion (samme som landing page) */}
                <section id="donationSection">
                    {/* containeren 1 */}
                    <div id="container1">
                        {/* banner2 */}
                        <img src={bannerImg2} alt="banner2" />
                        {/* textContainer */}
                        <div id="textContainer">
                            {/* text */}
                            <div id="text">
                                <h3>Donationer til Dato</h3>
                                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
                                {/* pris */}
                                <p id="pris">452.231.50 kr</p>
                                <p id="mindreTxt">Tak fordi du handler brugt, med omtanke for klimaet</p>
                            </div>
                        </div>
                    </div>
                    {/* containeren 2 */}
                    <div id="container2">
                        {/* banner3 */}
                        <img src={bannerImg3} alt="banner3" />
                        {/* textContainer */}
                        <div id="textContainer">
                            {/* text */}
                            <div id="text">
                                <h3>Donationer til Dato</h3>
                                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
                                {/* pris */}
                                <p id="pris">452.231.50 kr</p>
                                <p id="mindreTxt">Tak fordi du handler brugt, med omtanke for klimaet</p>
                            </div>
                        </div>
                    </div>
                </section>
                <FooterComponent />
            </main>
        </div>
    );
}