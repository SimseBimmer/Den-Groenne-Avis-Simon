import React from "react";
import "./ProductView.scss";

// Viser detaljer for valgt produkt
export default function ProductView({ product, loading, onBack }) {
  if (loading) return <p>Indlæser produkt...</p>;
  if (!product) return null;

  return (
    <div id="productView">
      <button id="backToListBtn" onClick={onBack}>
        ← Tilbage til produkter
      </button>
      <div id="productViewBox">
        <img
          id="productViewImage"
          src={product.image?.startsWith("http") ? product.image : `http://localhost:4000${product.image}`}
          alt={product.name}
          style={{ width: "100%", maxWidth: "500px", marginBottom: "1.5rem" }}
        />
        <h1 id="productViewTitle">{product.name}</h1>
        <p id="productViewDescription">{product.description}</p>
        <div id="productViewPrice">
          <strong>Pris: {product.price} kr</strong>
        </div>
      </div>
    </div>
  );
}
