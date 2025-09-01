import React, { useEffect, useState, useRef } from 'react';
import './Slideshow.scss';

// API endpoint til slides
const API_URL = 'http://localhost:3000/api/slides';

const Slideshow = () => {
    // slides: array med slide objects i
    // current: index på current slide
    // fade: fade transition
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);
    const intervalRef = useRef(null);

    // Henter slides fra backend når component loader
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setSlides(data);
                // Log kun én gang når slides faktisk sættes
                if (data && data.length > 0) {
                    console.log('Slides fetched', data);
                }
            })
            .catch((err) => {
                // Error handling
                console.error('Failed to fetch slides:', err);
                setSlides([]);
            });
    }, []);

    // Skifter slide hver 4. sekund med fade transition
    useEffect(() => {
        if (slides.length === 0) return;
        intervalRef.current = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % slides.length); // næste slide
                setFade(true); // fade in
            }, 400); // fade duration
        }, 4000);
        return () => clearInterval(intervalRef.current);
    }, [slides, current]);

    // Viser loading tekst hvis slides ikke er hentet
    if (slides.length === 0) {
        return (
            <div className="slideshow">
                <div style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>Indlæser slideshow...</div>
            </div>
        );
    }

    // Sørger for at billed-link virker både hvis det er absolut eller relativt
    const getImageUrl = (url) =>
        url.startsWith('http') ? url : `http://localhost:3000${url}`;

    return (
        <div className="slideshow">
            {/* Viser aktivt billede, fade class laver transition */}
            <img
                src={getImageUrl(slides[current].imageUrl)}
                alt={slides[current].name}
                className={`slideshow-bg${fade ? ' fade' : ''}`}
            />
            <div className="slideshow-indicators">
                {/* Cirkler under billedet, en for hver slide */}
                {slides.map((_, idx) => (
                    <span
                        key={idx}
                        // Aktiv cirkel får class og transition
                        className={`indicator${idx === current ? ' active' : ''}${idx === current && fade ? ' fade' : ''}`}
                        // Klik på cirkel skifter til det slide med transition
                        onClick={() => {
                            setFade(false);
                            setTimeout(() => {
                                setCurrent(idx);
                                setFade(true);
                            }, 200);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow;
