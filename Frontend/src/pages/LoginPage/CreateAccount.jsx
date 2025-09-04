import React, { useState } from 'react';
import './Login.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import FooterComponent from '../../components/Footer/FooterComponent.jsx';
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import bannerImg2 from "../../assets/images/bannerImages/banner_image2.jpg";
import bannerImg3 from "../../assets/images/bannerImages/banner_image3.jpg";
import { useNavigate, Link } from 'react-router-dom';

export default function CreateAccount() {
    // State til signup-form felter og beskeder
    const [signupName, setSignupName] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    // Hvis brugeren er logget ind, vis ikke denne side
    const isLoggedIn = !!localStorage.getItem('accessToken');
    if (isLoggedIn) {
        return null;
    }

    // Funktion til at håndtere signup
    async function handleSignup(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Simpel validering af alle felter
        if (
            !signupName ||
            !lastname ||
            !address ||
            !zipcode ||
            !city ||
            !signupEmail ||
            !signupPassword
        ) {
            setError('Alle felter skal udfyldes');
            return;
        }
        if (!/^\d{4}$/.test(zipcode)) {
            setError('Postnummer skal være 4 cifre');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(signupEmail)) {
            setError('Email skal være gyldig');
            return;
        }
        if (signupPassword.length < 6) {
            setError('Password skal være mindst 6 tegn');
            return;
        }
        if (!termsAccepted) {
            setError('Du skal acceptere betingelserne');
            return;
        }

        setLoading(true);
        try {
            // Kald backend for at oprette bruger
            const res = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: signupName,
                    lastname,
                    address,
                    zipcode,
                    city,
                    email: signupEmail,
                    password: signupPassword,
                    hasNewsletter: false,
                    hasNotification: false,
                    refreshToken: '',
                    isActive: true
                })
            });
            if (!res.ok) throw new Error('Kunne ikke oprette bruger');
            setSuccess('Konto oprettet! Du kan nu logge ind.');
            setSignupName('');
            setLastname('');
            setAddress('');
            setZipcode('');
            setCity('');
            setSignupEmail('');
            setSignupPassword('');
            // Vent 1.5 sekunder og send bruger til login
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            // Hvis oprettelse fejler
            setError('Kunne ikke oprette bruger');
        }
        setLoading(false);
    }

    return (
        <div id='loginPageContainer'>
            <main id='loginPage'>
                <HeaderComponent />
                <GreenDivider />
                <div id='loginFormContainer'>
                    <h2>Opret en konto</h2>
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
                            {/* Viser succesbesked når oprettelse lykkes */}
                            {success}
                        </div>
                    )}
                    {/* Signup form */}
                    <form onSubmit={handleSignup}>
                        {/* Fornavn */}
                        <label htmlFor="signupFirstname">Fornavn</label>
                        <input
                            type="text"
                            id="signupFirstname"
                            placeholder="Fornavn"
                            value={signupName}
                            onChange={e => setSignupName(e.target.value)}
                            required
                        />
                        {/* Efternavn */}
                        <label htmlFor="signupLastname">Efternavn</label>
                        <input
                            type="text"
                            id="signupLastname"
                            placeholder="Efternavn"
                            value={lastname}
                            onChange={e => setLastname(e.target.value)}
                            required
                        />
                        {/* Adresse */}
                        <label htmlFor="signupAddress">Adresse</label>
                        <input
                            type="text"
                            id="signupAddress"
                            placeholder="Adresse"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                        />
                        {/* Postnummer */}
                        <label htmlFor="signupZipcode">Postnummer</label>
                        <input
                            type="text"
                            id="signupZipcode"
                            placeholder="Postnummer"
                            value={zipcode}
                            onChange={e => setZipcode(e.target.value.replace(/\D/, ''))}
                            maxLength={4}
                            required
                        />
                        {/* By */}
                        <label htmlFor="signupCity">By</label>
                        <input
                            type="text"
                            id="signupCity"
                            placeholder="By"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                        />
                        {/* Email */}
                        <label htmlFor="signupEmail">Email</label>
                        <input
                            type="email"
                            id="signupEmail"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            required
                        />
                        {/* Password */}
                        <label htmlFor="signupPassword">Adgangskode</label>
                        <input
                            type="password"
                            id="signupPassword"
                            placeholder="Password (min. 6 tegn)"
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                            required
                        />
                        {/* Link til login - FØR knappen og checkbox */}
                        <p>
                            Har du allerede en konto? klik <Link to="/login">her</Link> for at logge ind
                        </p>
                        {/* Checkbox og knap i flex-row */}
                        <div id="signupFormBottomRow">
                            <div id="termsCheckboxWrapper">
                                <input
                                    type="checkbox"
                                    id="termsCheckbox"
                                    checked={termsAccepted}
                                    onChange={e => setTermsAccepted(e.target.checked)}
                                />
                                <label htmlFor="termsCheckbox">
                                    Jeg har læst og forstået de gældende betingelser for oprettelse af kundekonto og brug af denne side
                                </label>
                            </div>
                            {/* Opret knap */}
                            <button type="submit" disabled={loading || !termsAccepted}>
                                Opret
                            </button>
                        </div>
                    </form>
                </div>
                <GreenDivider />
                {/* Donation-sektion (samme som landing page) */}
                <section id="donationSection">
                    {/* containeren 1 */}
                    <div id="container1">
                        <img src={bannerImg2} alt="banner2" />
                        <div id="textContainer">
                            <div id="text">
                                <h3>Donationer til Dato</h3>
                                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
                                <p id="pris">452.231.50 kr</p>
                                <p id="mindreTxt">Tak fordi du handler brugt, med omtanke for klimaet</p>
                            </div>
                        </div>
                    </div>
                    {/* containeren 2 */}
                    <div id="container2">
                        <img src={bannerImg3} alt="banner3" />
                        <div id="textContainer">
                            <div id="text">
                                <h3>Donationer til Dato</h3>
                                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
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