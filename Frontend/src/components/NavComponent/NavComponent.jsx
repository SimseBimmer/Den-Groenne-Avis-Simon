import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavComponent.scss';
import BurgerIcon from '../../assets/images/NAV-BurgerNav.svg';
import CloseIcon from '../../assets/images/NAV-CloseNav.svg';

export default function NavComponent() {
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const navigate = useNavigate();

    // Listen for login status changes
    useEffect(() => {
        function updateStatus() {
            setLoggedIn(!!localStorage.getItem('accessToken'));
        }
        window.addEventListener('loginStatusChanged', updateStatus);
        return () => window.removeEventListener('loginStatusChanged', updateStatus);
    }, []);

    function handleLogout() {
        if (window.confirm('Er du sikker på, at du vil logge ud?')) {
            localStorage.removeItem('accessToken');
            setLoggedIn(false);
            window.dispatchEvent(new Event('loginStatusChanged'));
            setOpen(false);
            navigate('/');
        }
    }

    return (
        <div>
            {/* Burger menu vises kun når menuen er lukket */}
            {!open && (
                <button className="nav-burger-btn" onClick={() => setOpen(true)}><img src={BurgerIcon} alt="Open navigation" /></button>
            )}
            {/* Navigation drawer */}
            <nav className={`nav-drawer${open ? ' open' : ''}`}>
                {/* Luk-knap */}
                <button className="nav-close-btn" onClick={() => setOpen(false)}><img src={CloseIcon} alt="Close navigation" /></button>
                {/* Navigation links */}
                <ul>
                    <li><NavLink to="/" onClick={() => setOpen(false)}>Forside</NavLink></li>
                    <li><NavLink to="/produkter" onClick={() => setOpen(false)}>Produkter</NavLink></li>
                    <li><NavLink to="/nyheder" onClick={() => setOpen(false)}>Nyheder</NavLink></li>
                    <li><NavLink to="/kontakt" onClick={() => setOpen(false)}>Kontakt</NavLink></li>
                    {loggedIn ? (
                        <>
                            <li><NavLink to="/minside" onClick={() => setOpen(false)}>Min side</NavLink></li>
                            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>Log ud</button></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink></li>
                            <li><NavLink to="/opret" onClick={() => setOpen(false)}>Opret konto</NavLink></li>
                        </>
                    )}
                </ul>
            </nav>
            {/* Baggrund der lukker menuen hvis man klikker udenfor */}
            {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
        </div>
    );
}
