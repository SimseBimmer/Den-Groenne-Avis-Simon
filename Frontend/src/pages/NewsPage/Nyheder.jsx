import React, { useEffect, useState } from 'react';
import './Nyheder.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';
import { useLocation } from 'react-router-dom';

export default function Nyheder() {
    // loader alle nyheder
    const [news, setNews] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:3000/api/news')
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
                // Vælg artikel fra state.slug hvis den findes, ellers første nyhed
                if (location.state && location.state.slug) {
                    const found = data.find(n => n.slug === location.state.slug);
                    setSelected(found || data[0] || null);
                } else {
                    setSelected(data[0] || null);
                }
            })
            .catch(() => setLoading(false));
        // location.state skal kun bruges ved første load
        // eslint-disable-next-line
    }, []);

    // loader detaljer for valgt nyhed og bevarer teaser/image fra listen hvis de mangler i details
    useEffect(() => {
        if (!selected || !selected.slug) return;
        fetch(`http://localhost:3000/api/news/${selected.slug}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setSelected(prev => ({
                    ...prev,
                    ...data,
                    teaser: data.teaser || prev.teaser,
                    imageUrl: data.imageUrl || prev.imageUrl
                }));
            });
    }, [selected && selected.slug]);

    return (
        <div id="newsPage">
            <HeaderComponent />
            <div id="breadCrumbNav">
                <BreadcrumbNav path={['Home', 'Nyheder']} />
            </div>
            <div id="newsLayout">
                {/* venstre: valgt artikel */}
                <main id="newsMain">
                    {loading || !selected ? (
                        <div>Indlæser nyhed...</div>
                    ) : (
                        <>
                            <h1 id="newsTitle">{selected.title}</h1>
                            <img
                                id="newsMainImage"
                                src={selected.imageUrl.startsWith('http') ? selected.imageUrl : 'http://localhost:3000' + selected.imageUrl}
                                alt={selected.title}
                            />
                            <div id="newsContent">
                                {/* teaser som intro */}
                                <p id="newsTeaser">{selected.teaser}</p>
                                {/* content som hovedtekst */}
                                <p id="newsText">{selected.content}</p>
                            </div>
                        </>
                    )}
                </main>
                {/* højre: liste over andre artikler */}
                <aside id="newsAside">
                    <div id="newsAsideBox">
                        <h3>Se også...</h3>
                        <ul>
                            {news.map(article => (
                                <li
                                    key={article.id}
                                    id={selected && article.id === selected.id ? 'activeNews' : undefined}
                                    onClick={() => setSelected(article)}
                                >
                                    <span>{article.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}