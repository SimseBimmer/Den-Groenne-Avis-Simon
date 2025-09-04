import React, { useState, useEffect } from "react";
import './CreateAdPage.scss';
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from '../../components/Footer/FooterComponent.jsx';

// Opret annonce-side
export default function CreateAdPage() {
  // State til alle felter i formen
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // brugerdata med id

  // Hent kategorier fra backend når siden loader
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Hent bruger fra localStorage og backend
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser.email) {
      fetch(`http://localhost:4000/api/users?email=${encodeURIComponent(localUser.email)}`)
        .then(res => res.json())
        .then(users => {
          // Find bruger med samme email
          const found = Array.isArray(users)
            ? users.find(u => u.email === localUser.email)
            : (users && users.email === localUser.email ? users : null);
          if (found && found.id) {
            setUser(found);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  // Når brugeren trykker på "Opret"
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Tjek om bruger er logget ind og har id
    if (!user || !user.id) {
      setError('Du skal være logget ind for at oprette en annonce');
      return;
    }
    // Tjek at alle felter er udfyldt
    if (!title || !category || !description || !imageUrl || !price) {
      setError('Alle felter skal udfyldes');
      return;
    }
    setLoading(true);
    try {
      // Find categoryId fra valgt kategori slug
      const selectedCategory = categories.find(cat => cat.slug === category);
      if (!selectedCategory) {
        setError('Ugyldig kategori');
        setLoading(false);
        return;
      }
      // Hent accessToken fra localStorage
      const accessToken = localStorage.getItem('accessToken');
      // Send annonce til backend med authorization header
      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tilføj authorization header hvis token findes
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          name: title,
          categoryId: selectedCategory.id,
          description: description,
          image: imageUrl,
          price: Number(price)
          // userId: user.id // fjernet, backend bruger token
        })
      });
      if (!res.ok) {
        // Log fejlbesked fra backend for debugging
        const errorData = await res.json();
        console.error('Fejl fra backend:', errorData);
        setError(errorData.error || 'Kunne ikke oprette annonce');
        setLoading(false);
        return;
      }
      setSuccess('Din annonce er oprettet!');
      // Nulstil felter
      setTitle('');
      setCategory('');
      setDescription('');
      setImageUrl('');
      setPrice('');
    } catch (err) {
      setError('Kunne ikke oprette annonce');
    }
    setLoading(false);
  }

  return (
    <div id="createAdPageContainer">
      <HeaderComponent />

      <main id="createAdPage">
        <GreenDivider />
        <div id="loginFormContainer">
          <h2>Opret ny annonce</h2>
          {/* Viser fejl hvis noget mangler */}
          {error && (
            <div id="loginErrorBanner">{error}</div>
          )}
          {/* Viser succes hvis annonce blev oprettet */}
          {success && (
            <div id="loginSuccessBanner">{success}</div>
          )}
          {/* Selve formen */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Titel</label>
            <input
              type="text"
              id="title"
              placeholder="Indtast titel"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Vælg kategori</option>
              {/* Viser alle kategorier fra backend */}
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <label htmlFor="description">Annonce tekst</label>
            <textarea
              id="description"
              placeholder="Indtast annonce tekst"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            <label htmlFor="imageUrl">Url til billede</label>
            <input
              type="text"
              id="imageUrl"
              placeholder="Indtast billede URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              required
            />
            <label htmlFor="price">Pris</label>
            <input
              type="number"
              id="price"
              placeholder="Indtast pris"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Opretter..." : "Opret"}
            </button>
          </form>
        </div>
      </main>
      <FooterComponent />

    </div>
  );
}

