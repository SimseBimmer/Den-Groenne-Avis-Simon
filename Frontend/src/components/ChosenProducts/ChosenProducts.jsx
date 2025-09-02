import React, { useEffect, useState } from "react";
import "./ChosenProducts.scss";

// Komponent til at vise udvalgte produkter (10 tilfældige)
export default function ChosenProducts() {
  const [products, setProducts] = useState([]);

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

  return (
    <section id="chosenProducts">
      <h2>Udvalgte produkter</h2>
      <div id="chosenProductsRow">
        {products.map(product => (
          <div className="chosenProduct" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="productTitle">{product.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
