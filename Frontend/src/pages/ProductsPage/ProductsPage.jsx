import React, { useEffect, useState } from "react";
import './ProductsPages.scss';
import { useNavigate, useLocation } from "react-router-dom";
import HeaderComponent from '../../components/Header/HeaderComponent.jsx';
import FooterComponent from '../../components/Footer/FooterComponent.jsx';
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import ProductView from "../../components/ProductView/ProductView";
import ProductComments from "../../components/ProductComments/ProductComments"; 

// Antal produkter per side
const PRODUCTS_PER_PAGE = 9;

export default function ProductsPage() {
  // State til kategorier og produkter
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hent alle kategorier fra backend
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Hent produkter (alle eller efter kategori)
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:4000/api/products";
    if (selectedCategory) {
      url = `http://localhost:4000/api/products/category/${selectedCategory.slug}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Products API response:", data);
        // Hvis backend returnerer { products: [...] }
        if (Array.isArray(data)) setProducts(data);
        else if (data && Array.isArray(data.products)) setProducts(data.products);
        else {
          setProducts([]);
          // Vis evt. fejlbesked i UI
          alert("FEJL: API'et returnerer ikke et array. Se konsollen for detaljer.");
        }
      })
      .catch((err) => {
        setProducts([]);
        alert("FEJL: Kunne ikke hente produkter fra API'et");
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Hvis man står på en side der ikke findes (fx vælger kategori med få produkter)
  useEffect(() => {
    if (page > 1 && (page - 1) * PRODUCTS_PER_PAGE >= products.length) {
      setPage(1);
    }
  }, [products]);

  // Pagination logik
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Når man klikker på en kategori
  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setPage(1);
  }

  // Når man klikker på "Alle kategorier"
  function handleAllCategoriesClick() {
    setSelectedCategory(null);
    setPage(1);
  }

  // Når man klikker på et produkt
  function handleProductClick(slug) {
    setProductLoading(true);
    // Hent produktdata fra backend vha. slug
    fetch(`http://localhost:4000/api/products/${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => setSelectedProduct(data))
      .catch(() => setSelectedProduct(null))
      .finally(() => setProductLoading(false));
  }

  // Tilbage til produktlisten
  function handleBackToList() {
    setSelectedProduct(null);
  }

  // Pagination knapper
  function prevPage() {
    if (page > 1) setPage(page - 1);
  }
  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  // Når categories er hentet, tjek om der er slug i location.state og sæt kategori
  useEffect(() => {
    if (location.state && location.state.slug && categories.length > 0) {
      const cat = categories.find(c => c.slug === location.state.slug);
      if (cat) {
        setSelectedCategory(cat);
      } else {
        setSelectedCategory(null);
      }
      // Fjern slug fra state så det ikke loader igen ved navigation
      navigate("/produkter", { replace: true, state: {} });
    }
  }, [location.state, categories, navigate]);

  return (
    <div id="productsPageContainer">
      <HeaderComponent />
      <main id="productsMain">
        <GreenDivider />
        <div id="productsContentWrapper">
          <aside id="productsCategories">
            <nav>
              {/* Fjern dropdown til kategorier */}
              {/* Liste med kategorier */}
              <ul id="categoryList">
                <li
                  id={!selectedCategory ? "categorySelected" : ""}
                  style={{
                    fontWeight: !selectedCategory ? 600 : 400,
                    cursor: "pointer"
                  }}
                  onClick={handleAllCategoriesClick}
                >
                  All categories
                </li>
                {categories.map(cat => (
                  <li
                    key={cat.id}
                    id={selectedCategory?.id === cat.id ? "categorySelected" : ""}
                    onClick={() => handleCategoryClick(cat)}
                    style={{
                      fontWeight: selectedCategory?.id === cat.id ? 600 : 400,
                      cursor: "pointer"
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <section id="productsContent">
            {/* Viser enten produktvisning eller grid med produkter */}
            {selectedProduct ? (
              <>
                <ProductView
                  product={selectedProduct}
                  loading={productLoading}
                  onBack={handleBackToList}
                />
                {/* Grøn divider under produktvisning */}
                <GreenDivider />
                {/* Kommentarsektion under divider */}
                <ProductComments
                  productId={selectedProduct.id}
                  sellerName={selectedProduct.sellerName}
                  currentUser={JSON.parse(localStorage.getItem('user') || '{}')}
                  isLoggedIn={!!localStorage.getItem('accessToken')}
                />
              </>
            ) : (
              <ProductsGrid
                products={paginatedProducts}
                loading={loading}
                onProductClick={handleProductClick}
                page={page}
                totalPages={totalPages}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            )}
          </section>
        </div>
      </main>
      <FooterComponent />
    </div>
  );
}