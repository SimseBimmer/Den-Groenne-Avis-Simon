import React, { useEffect, useState } from 'react';
import './HeaderComponent.scss';
import NavComponent from '../NavComponent/NavComponent';
import Slideshow from '../Slideshow/Slideshow';
import Logo from '../../assets/images/Logo.svg';
import ArrowImg from '../../assets/images/Navbar Active.svg';
import { NavLink, useNavigate } from 'react-router-dom';

// Header-komponent til toppen af siden
export default function HeaderComponent(props) {
  const navigate = useNavigate();

  // Dummy login check (skal laves rigtigt senere)
  const isLoggedIn = false;

  // Klik på konto-ikon: gå til minside hvis logget ind, ellers login
  function handleAccountClick(e) {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("/minside");
    } else {
      navigate("/login");
    }
  }

  return (
    <div id='HeaderComponent'>
      <header>
        <div id="headerContainer">
          <div>
            <h1>Den Grønne<span>Avis</span></h1>
          </div>
          <div id='headerRight'>
            {/* choose category */}
            <div id='categoryDropdown'>
              <p>Vælg kategori</p>
              <img src="/src/assets/images/Expand Arrow.svg" alt="" />
              {/* Dropdown menu */}
              <ul id="dropdownMenu" style={{ display: "none" }}>
                {/* Her skal der mappes kategorier ind senere */}
                <li>Camping</li>
                <li>Elektronik</li>
                <li>Have og byg</li>
                <li>Tøj og mode</li>
                {/* ... */}
              </ul>
            </div>
            {/* opret annonce */}
            <div id='createAd'>
              <p>Opret annonce</p>
            </div>
            {/* nav like list (use navlink) */}
            <ul>
              <li>
                <NavLink to="#">
                  {/* Mail ikon */}
                  <img src="/src/assets/images/Important Mail.svg" alt="Mail" />
                </NavLink>
              </li>
              <li>
                <NavLink to="#">
                  {/* Info ikon */}
                  <img src="/src/assets/images/Info Squared.svg" alt="Info" />
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={isLoggedIn ? "/minside" : "/login"}
                  onClick={handleAccountClick}
                >
                  {/* Konto ikon, klik går til minside eller login */}
                  <img src="/src/assets/images/Test Account.svg" alt="Account" />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}