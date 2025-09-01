import React, { useEffect, useState } from 'react';
import './LandingPage.scss';
import { useNavigate } from 'react-router-dom';

// Hovedside med nyheder
export default function LandingPage() {
  // news: gemmer nyheder fra backend
  // loading: viser om vi loader data
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Henter nyheder fra backend når siden loader
  useEffect(() => {
    fetch('http://localhost:3000/api/news')
      .then(res => res.json())
      .then(data => {
        // Shuffle array så vi får tilfældige nyheder
        let shuffled = data.sort(() => Math.random() - 0.5);
        // Tag kun de første 3 nyheder
        let threeNews = shuffled.slice(0, 3);
        setNews(threeNews);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // error handling
  }, []);

  return (
    <div id='LandingPage'>
      <div id='ContentContainer'>
        <div id='MainContentContainer'>
          <h2>Nyheder</h2>

          <div id='MainContent'>
            {/* Viser loading tekst hvis vi loader */}
            {loading ? (
              <div>Indlæser nyheder...</div>
            ) : (
              <ul id='NewsList'>
                {/* Mapper over nyheder og viser dem */}
                {news.map(article => (
                  <li id='NewsArticle' key={article.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/nyheder`, { state: { slug: article.slug } })} >
                    {/* Sørger for at billed-link virker både hvis det er absolut eller relativt */}
                    <img src={article.imageUrl.startsWith('http') ? article.imageUrl : 'http://localhost:3000' + article.imageUrl} alt={article.title} />
                    <div>
                      <p>18 august 2024:</p>
                      <h3>{article.title}</h3>
                      <p>{article.teaser}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}