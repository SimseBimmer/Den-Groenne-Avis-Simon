import React, { useEffect, useState } from 'react';
import './ProductViewPage.scss';
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import BreadcrumbNav from '../../components/BreadcrumbNav/BreadcrumbNav.jsx';
import { useParams } from 'react-router-dom';
import ColorHeartWhite from '../../assets/images/FavoriteWhite.svg';
import CommentSection from '../../components/CommentSection/CommentSection.jsx';

export default function ProductViewPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);

    // loader produkt fra backend
    useEffect(() => {
        if (!slug) return;
        fetch(`http://localhost:3000/api/products/${encodeURIComponent(slug)}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(() => setProduct(null));
    }, [slug]);

    const crumbLinks = [
        '/',
        '/produkter'
    ];

    return (
        <div id="productViewPage">
            <HeaderComponent />
            <div id="breadCrumbNav">
                <BreadcrumbNav
                    path={['Home', 'Produkter', product?.title || '...']}
                    links={crumbLinks}
                />
            </div>
            {/* loader */}
            {!product ? (
                <div id="productViewContent">Indlæser produkt...</div>
            ) : (
                <div id="productViewContent">
                    <section id="productDetails">
                        <h1 id="productTitle">{product.title}</h1>
                        <div id="imageAndDetails">
                            <img
                                id="productImage"
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : 'http://localhost:3000' + product.imageUrl}
                                alt={product.title}
                            />
                            <div id="productTextDetails">
                                <p id="productDescription">{product.description}</p>
                            </div>
                        </div>
                        <div id="instructionsBox">
                            <p id="instructions">{product.procedure}</p>
                        </div>
                        <div id="productPrice">
                            <span>Pris: {product.price} kr</span>
                        </div>
                        {/* kommentar sektion */}
                        <CommentSection productSlug={product.slug} />
                    </section>
                    <section id="recipeCard" aria-label={`Opskrift på ${product.title}`}>
                        <header id="recipeCardHeader">
                            <h2>Opskrift</h2>
                            <div id="recipeCardLikes">
                                <img src={ColorHeartWhite} alt="Antal likes" />
                            </div>
                        </header>
                        <div id="productInfoBox">
                            <div>
                                <span>Varighed: {product.durationInMinutes} min</span>
                            </div>
                            <div>
                                <span>Antal: {product.amount} stk</span>
                            </div>
                        </div>
                        <ul id="ingredientList">
                            {/* mapper ingredienser */}
                            {product.productIngredients?.map(ing => (
                                <li key={ing.id}>
                                    {ing.amount} {ing.units?.abbreviation} {ing.ingredients?.title}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
}