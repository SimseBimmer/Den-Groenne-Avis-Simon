import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import './HeaderComponent.scss';

// Header til toppen af siden
export default function HeaderComponent() {
  const navigate = useNavigate();

  // Tjekker om man er logget ind
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  // Dropdown til kategorier
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Kategorier fra API
  const [categories, setCategories] = useState([]);
  const accountDropdownRef = useRef(null);

  // Valgt kategori
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Dropdown til konto
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Henter kategorier fra backend
  useEffect(() => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        // Hvis der sker fejl
        console.error("Kunne ikke hente kategorier", err);
      });
  }, []);

  // Opdaterer login status hvis localStorage ændres
  useEffect(() => {
    function handleLoginStatusChanged() {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    }
    window.addEventListener('loginStatusChanged', handleLoginStatusChanged);
    return () => window.removeEventListener('loginStatusChanged', handleLoginStatusChanged);
  }, []);

  // Lukker konto-dropdown hvis man klikker udenfor
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
    }
    if (isAccountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountDropdownOpen]);

  // Åbner/lukker kategori-dropdown
  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // Vælger en kategori
  function handleCategorySelect(category) {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }

  // Vælger "Alle kategorier"
  function handleAllCategoriesSelect() {
    setSelectedCategory({ id: 'all', name: 'Alle kategorier', slug: '' });
    setIsDropdownOpen(false);
  }

  // Trykker på pilen - går til produkter med valgt kategori
  function handleArrowClick(e) {
    e.stopPropagation();
    if (selectedCategory && selectedCategory.slug) {
      navigate('/produkter', { state: { slug: selectedCategory.slug } });
    } else {
      navigate('/produkter');
    }
  }

  // Konto-ikon klik
  function handleAccountClick(e) {
    e.preventDefault();
    setIsAccountDropdownOpen((open) => !open);
  }

  // Login klik
  function handleLoginClick() {
    setIsAccountDropdownOpen(false);
    navigate("/login");
  }

  // Signup klik
  function handleSignupClick() {
    setIsAccountDropdownOpen(false);
    navigate("/signup");
  }

  // Min side klik
  function handleMyAccountClick() {
    setIsAccountDropdownOpen(false);
    navigate("/minside");
  }

  // Log ud
  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('loginStatusChanged'));
    setIsAccountDropdownOpen(false);
    window.location.href = '/';
  }

  return (
    <div id="HeaderComponent">
      <header>
        <div id="headerContainer">
          <div id="siteLogo">
            <NavLink to="/">
              <h1>
                <span id="ptOne">Den Grønne</span>
                <span id="ptTwo">Avis</span>
              </h1>
            </NavLink>
          </div>
          <div id="headerRight">
            <div id="categoryDropdown">
              <div
                id="categorySelection"
                onClick={handleDropdownClick}
              >
                <p>
                  {selectedCategory ? selectedCategory.name : "Vælg kategori"}
                </p>
                <button
                  id="arrowBtn"
                  onClick={selectedCategory ? handleArrowClick : undefined}
                  tabIndex={selectedCategory ? 0 : -1}
                  aria-label="Gå til produkter"
                  type="button"
                  disabled={!selectedCategory}
                  style={{ pointerEvents: selectedCategory ? 'auto' : 'none' }}
                >
                  <img
                    src="/src/assets/images/Expand Arrow.svg"
                    alt=""
                    id="expandArrow"
                  />
                </button>
              </div>
              <ul
                id="dropdownMenu"
                style={{ display: isDropdownOpen ? 'block' : 'none' }}
              >
                <li id="allCategories" onClick={handleAllCategoriesSelect}>
                  Alle kategorier
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    id={`category-${cat.id}`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
            <div id="createAd">
              <Link to="/createad">
                <p>Opret annonce</p>
              </Link>
            </div>
            <ul id="headerNavIcons">
              <li>
                <NavLink to="#">
                  <img src="/src/assets/images/Important Mail.svg" alt="Mail" />
                </NavLink>
              </li>
              <li>
                <NavLink to="#">
                  <img src="/src/assets/images/Info Squared.svg" alt="Info" />
                </NavLink>
              </li>
              <li ref={accountDropdownRef} style={{ position: "relative" }}>
                {/* Konto ikon klik åbner dropdown */}
                <button
                  id="accountBtn"
                  onClick={handleAccountClick}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer"
                  }}
                  aria-label="Konto"
                  type="button"
                >
                  <img src="/src/assets/images/Test Account.svg" alt="Account" />
                </button>
                {/* Dropdown menu for konto */}
                <ul
                  id="dropdownMenu"
                  style={{
                    display: isAccountDropdownOpen ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    left: 'auto',
                    zIndex: 10
                  }}
                >
                  {!isLoggedIn ? (
                    <>
                      <li onClick={handleLoginClick}>Login</li>
                      <li onClick={handleSignupClick}>Sign up</li>
                    </>
                  ) : (
                    <>
                      <li onClick={handleMyAccountClick}>Min side</li>
                      <li onClick={handleLogout}>Log ud</li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}