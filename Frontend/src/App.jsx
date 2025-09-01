import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// global scss
import './App.scss'
// page imports
import LandingPage from './pages/LandingPage/LandingPage';
import ProductPage from './pages/ProductsPage/ProductPage.jsx';
import Nyheder from './pages/NewsPage/Nyheder';
import Kontakt from './pages/ContactPage/Kontakt';
import Login from './pages/LoginPage/Login';
import MinSide from './pages/MinSidePage/MinSide.jsx';
import CreateAccount from './pages/LoginPage/CreateAccount.jsx';
import ProductViewPage from './pages/ProductViewPage/ProductViewPage.jsx';
// component imports 
import FooterComponent from './components/Footer/FooterComponent.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/produkter" element={<ProductPage />} />
        <Route path="/produkt/:slug" element={<ProductViewPage />} />
        <Route path="/nyheder" element={<Nyheder />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opret" element={<CreateAccount />} />
        <Route path="/minside" element={<MinSide />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  </React.StrictMode>
);