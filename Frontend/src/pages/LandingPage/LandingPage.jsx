import React from "react";
import ChosenProducts from "../../components/ChosenProducts/ChosenProducts";
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import HeaderComponent from "../../components\Header";

// Landing page - forsiden af sitet
export default function LandingPage() {
  return (
    <div id="landingPage">
      <HeaderComponent />
      <GreenDivider />
      <ChosenProducts />
      <GreenDivider />

    </div>
  );
}