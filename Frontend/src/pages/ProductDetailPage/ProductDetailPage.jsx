import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import GreenDivider from "../../components/GreenDivider/GreenDivider";

// Enkel produktdetalje-side
export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setProduct(data);
      })
      .catch(() => setError("Kunne ikke hente produkt"));
  }, [slug]);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Indlæser produkt...</div>;

  return (
    <div id="productDetailPageContainer">
      <HeaderComponent />
      <main id="productDetailPage">
        <GreenDivider />
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} style={{ maxWidth: "400px" }} />
        <p>{product.description}</p>
        <p>Pris: {product.price} kr</p>
        {/* evt. flere detaljer */}
        <GreenDivider />
      </main>
      <FooterComponent />
    </div>
  );
}
