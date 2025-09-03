import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './HeaderComponent.scss';

// Header til toppen af siden
export default function HeaderComponent() {
  const navigate = useNavigate();

  // Dummy login check
  const isLoggedIn = false;

  // Dropdown åben/lukket
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Kategorier fra API
  const [categories, setCategories] = useState([]);

  // Valgt kategori
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Hent kategorier fra backend
  useEffect(() => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        // Fejl hvis noget går galt
        console.error("Kunne ikke hente kategorier", err);
      });
  }, []);

  // Åbn/luk dropdown
  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // Vælg kategori (også "Alle kategorier")
  function handleCategorySelect(category) {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }

  // Vælg "Alle kategorier"
  function handleAllCategoriesSelect() {
    setSelectedCategory({ id: 'all', name: 'Alle kategorier', slug: '' });
    setIsDropdownOpen(false);
  }

  // Klik på pilen: naviger til produkter med valgt kategori
  function handleArrowClick(e) {
    e.stopPropagation();
    // Naviger til produkter, send valgt kategori (kan være null eller "alle")
    navigate('/produkter', { state: { selectedCategory } });
  }

  // Konto-ikon klik
  function handleAccountClick(e) {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("/minside");
    } else {
      navigate("/login");
    }
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
              // Dropdown åbner altid, pilen kan kun trykkes hvis kategori valgt
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
              <p>Opret annonce</p>
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
              <li>
                <NavLink
                  to={isLoggedIn ? "/minside" : "/login"}
                  onClick={handleAccountClick}
                >
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