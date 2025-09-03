import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import ChosenProducts from "../../components/ChosenProducts/ChosenProducts";
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import FooterComponent from '../../components/Footer/FooterComponent.jsx';

import "./LandingPage.scss";

// banner billeder
import bannerImg1 from "../../assets/images/bannerImages/banner_image1.jpg";
import bannerImg2 from "../../assets/images/bannerImages/banner_image2.jpg";
import bannerImg3 from "../../assets/images/bannerImages/banner_image3.jpg";

// Landing page
export default function LandingPage() {
  // State til produkter fra API
  const [allProducts, setAllProducts] = useState([]);

  // Hent produkter fra API når siden loader
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => {
        console.error("Kunne ikke hente produkter", err);
      });
  }, []);

  // Del produkterne op i to rækker (fx 4 og 4)
  const chosenProducts = allProducts.slice(0, 4);
  const popularProducts = allProducts.slice(4, 8);

  return (
    <div id="landingPageContainer">
      <HeaderComponent />
      <div id="landingPage">
        <GreenDivider />
        <ChosenProducts title="Udvalgte produkter" products={chosenProducts} />
        <GreenDivider />
        <div id="dgaBanner">
          <img src={bannerImg1} alt="Banner" id="bannerImage" />
          <div id="bannerTextContainer">
            <div id="bannerText">
              <h2>Den Grønne Avis</h2>
              <p>Vi går forest i kampen om klimaet ved at give 2 kr. til klima-venlige formål, hver gang du handler brugt på Den Grønne Avis</p>
            </div>
          </div>
        </div>
        <GreenDivider />
        <ChosenProducts title="Populære produkter" products={popularProducts} />
        <GreenDivider />


        <section id="donationSection">
          {/* containeren 1 */}
          <div id="container1">
            {/* banner2 */}
            <img src={bannerImg2} alt="banner2" />
            {/* textContainer */}
            <div id="textContainer">
              {/* text */}
              <div id="text">
                <h3>Donationer til Dato</h3>
                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
                {/* pris */}
                <p id="pris">452.231.50 kr</p>
                <p id="mindreTxt">Tak fordi du handler brugt, med omtanke for klimaet</p>
              </div>
            </div>
          </div>

          {/* containeren 2 */}
          <div id="container2">
            {/* banner3 */}
            <img src={bannerImg3} alt="banner3" />
            {/* textContainer */}
            <div id="textContainer">
              {/* text */}
              <div id="text">
                <h3>Donationer til Dato</h3>
                <p id="stoerreTxt">Sammen med dig har vi siden starten indsamlet</p>
                {/* pris */}
                <p id="pris">452.231.50 kr</p>
                <p id="mindreTxt">Tak fordi du handler brugt, med omtanke for klimaet</p>
              </div>
            </div>
          </div>

        </section>
        <FooterComponent />

      </div>
    </div>
  );
}

{/* <img src={bannerImg2} alt="banner2" /> */ }
