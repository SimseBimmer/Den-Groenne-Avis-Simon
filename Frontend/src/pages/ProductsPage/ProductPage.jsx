import React, { useEffect, useState } from 'react';
import './Produkter.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import ArrowImg from '../../assets/images/Navbar Active.svg';
import ColorHeart from '../../assets/images/FavoriteBlack.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';

// Start med nogle kategorier (bruges kun til default)
const defaultCategories = [
    { label: 'Rundstykker', slug: 'morgenbroed' },
    { label: 'Baguettes', slug: 'baguettes' },
    { label: 'Franskbrød', slug: 'franskbroed' },
    { label: 'Kager', slug: 'kager' },
    { label: 'Rugbrød', slug: 'rugbroed' }
];

function getCategoryFromQuery(categories, search) {
    const params = new URLSearchParams(search);
    const slug = params.get('category');
    if (!slug) return null;
    return categories.find(c => c.slug === slug) || null;
}

export default function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    // selectedCategory: hvilken kategori er valgt
    const [selectedCategory, setSelectedCategory] = useState(defaultCategories[0]);
    // sort: hvordan skal produkterne sorteres
    const [sort, setSort] = useState('popularity');
    // products: produkter fra backend
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sæt kategori fra query string hvis den findes
    useEffect(() => {
        const cat = getCategoryFromQuery(defaultCategories, location.search);
        if (cat) setSelectedCategory(cat);
    }, [location.search]);

    // Hent produkter for valgt kategori
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3000/api/categories/' + selectedCategory.slug)
            .then(res => res.json())
            .then(data => {
                // Hent produkter fra categoryProducts
                let productList = [];
                if (data.categoryProducts) {
                    for (let i = 0; i < data.categoryProducts.length; i++) {
                        productList.push(data.categoryProducts[i].products);
                    }
                }
                // Sorter produkter
                if (sort === 'az') {
                    productList.sort((a, b) => a.title.localeCompare(b.title));
                }
                setProducts(productList);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [selectedCategory, sort]);

    // Find index af valgt kategori (til pilen)
    const selectedIdx = defaultCategories.findIndex(c => c.slug === selectedCategory.slug);

    return (
        <div id="ProductPage">
            <HeaderComponent
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={defaultCategories}
                arrowImg={ArrowImg}
                selectedIdx={selectedIdx}
            />
            <div id='breadCrumbNav'>
                <BreadcrumbNav path={['Home', 'Produkter']} />
            </div>

            <div id="productHeaderRow">
                <h2>{selectedCategory.title || selectedCategory.label}</h2>
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    id="productSortDropdown"
                >
                    <option value="popularity">Popularitet</option>
                    <option value="az">A -Z</option>
                </select>
            </div>

            {/* Produkt grid */}
            <div id="productGrid">
                {loading ? (
                    <div>Indlæser produkter...</div>
                ) : products.length === 0 ? (
                    <div>Ingen produkter fundet.</div>
                ) : (
                    products.map(product => (
                        <div id="productCard" key={product.id}>
                            <img src={product.imageUrl.startsWith('http') ? product.imageUrl : 'http://localhost:3000' + product.imageUrl} alt={product.title} id="productImg" />
                            <div id="productInfo">
                                <h3>{product.title}</h3>
                                <p>{product.description}</p>
                                <div id="productCardBottom">
                                    <button
                                        id="readMoreBtn"
                                        onClick={() => navigate(`/produkt/${product.slug}`)}
                                    >
                                        Læs mere
                                    </button>
                                    <div id="favoriteBtn">
                                        <span>0</span>
                                        <img src={ColorHeart} alt="Favorite" id="heartIcon" style={{ opacity: 0.5 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}