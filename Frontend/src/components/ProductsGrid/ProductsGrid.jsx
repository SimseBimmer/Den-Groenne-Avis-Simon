import React from "react";
import "./ProductsGrid.scss";

// Viser grid med produkter og pagination
export default function ProductsGrid({
  products,
  loading,
  onProductClick,
  page,
  totalPages,
  prevPage,
  nextPage
}) {
  // Loader vises hvis loading er true
  if (loading) return <p>Loading products...</p>;

  return (
    <>
      <div id="productsList">
        {Array.isArray(products) && products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          // Mapper produkter ud i grid
          Array.isArray(products) && products.map(prod => (
            <div
              key={prod.id}
              id="productCard"
              onClick={() => onProductClick(prod.slug)}
              style={{ cursor: "pointer" }}
            >
              <div id="productImageBox">
                <img
                  id="productImage"
                  src={prod.image?.startsWith("http") ? prod.image : `http://localhost:4000${prod.image}`}
                  alt={prod.name}
                />
                {prod.price && (
                  <span id="productPrice">Price: {prod.price} kr</span>
                )}
              </div>
              <div id="productText">
                <h3 id="productTitle">{prod.name}</h3>
                <p id="productDescription">
                  {/* Viser beskrivelse hvis den findes */}
                  {prod.description ? prod.description : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div id="productsPagination">
        {/* Pagination knapper */}
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} / {totalPages || 1}
        </span>
        <button onClick={nextPage} disabled={page === totalPages || totalPages === 0}>
          Next
        </button>
      </div>
    </>
  );
}
