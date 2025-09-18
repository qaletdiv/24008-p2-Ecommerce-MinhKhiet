"use client"
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import HeaderSlider from "../../components/HeaderSlider";
import Banner from "../../components/Banner";
import FeaturedProduct from "../../components/FeaturedProduct";
import HomeProducts from "../../components/HomeProducts";
import NewsLetter from "../../components/NewsLetter";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import { useAppContext } from "../../context/AppContext";

export default function Home() {
  const { loading, error, loadingStates, fetchProducts } = useAppContext();

  useEffect(() => {
    fetchProducts({ limit: 100 }); 
  }, []); 

  if (loadingStates.products) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <HeaderSlider />
        <Banner />
        <FeaturedProduct />
        <HomeProducts />
        <NewsLetter />
      </main>
      <Footer />
    </div>
  );
}
