import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// global scss
import './App.scss'
// page imports
import LandingPage from './pages/LandingPage/LandingPage';
import ProductsPage from './pages/ProductsPage/ProductsPage.jsx';
import Nyheder from './pages/NewsPage/Nyheder';
import Kontakt from './pages/ContactPage/Kontakt';
import Login from './pages/LoginPage/Login';
import MinSide from './pages/MinSidePage/MinSide.jsx';
import CreateAccount from './pages/LoginPage/CreateAccount.jsx';
import CreateAdPage from './pages/CreateAdPage/CreateAdPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/produkter" element={<ProductsPage />} />
        <Route path="/nyheder" element={<Nyheder />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/opret" element={<CreateAccount />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/minside" element={<MinSide />} />
        <Route path="/createad" element={<CreateAdPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);