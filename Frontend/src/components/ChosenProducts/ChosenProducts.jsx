import React, { useEffect, useState } from "react";
import "./ChosenProducts.scss";
import { useNavigate } from "react-router-dom";

// Komponent til at vise produkter med valgfri titel
export default function ChosenProducts({ title = "Udvalgte produkter" }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Hent produkter fra API ved load
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => {
        // Vælg 10 tilfældige produkter
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 10));
      });
  }, []);

  function handleProductClick(slug) {
    navigate("/produkter", { state: { productSlug: slug } });
  }

  return (
    <section id="chosenProducts">
      <h2>{title}</h2>
      <div id="chosenProductsRow">
        {products.map(product => (
          <div
            className="chosenProduct"
            key={product.id}
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(product.slug)}
          >
            <img src={product.image} alt={product.name} />
            <div className="productTitle">{product.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}