import React from "react";
import ProductCard from "./ProductCard";
import "../styles/HomeProducts.css";
import { useAppContext } from "../context/AppContext";

const HomeProducts = () => {

  const { products, router } = useAppContext();
  const displayProducts = products;

  return (
    <div className="home-products-container">
      <p className="home-products-title">Popular products</p>
      <div className="home-products-grid">
        {displayProducts.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
      <button onClick={() => { router.push('/all-products') }} className="home-products-see-more" suppressHydrationWarning={true}>
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
