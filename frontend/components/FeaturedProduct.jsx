import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import "../styles/FeaturedProduct.css";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.girl_with_earphone_image,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="featured-container">
      <div className="featured-header">
        <p className="featured-title">Featured Products</p>
        <div className="featured-underline"></div>
      </div>

      <div className="featured-grid">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="featured-item">
            <Image
              src={image}
              alt={title}
              className="featured-image"
              width={400}
              height={300}
            />
            <div className="featured-content">
              <p className="featured-content-title">{title}</p>
              <p className="featured-content-description">
                {description}
              </p>
              <button className="featured-buy-button" suppressHydrationWarning={true}>
                Buy now <Image className="featured-redirect-icon" src={assets.redirect_icon} alt="Redirect Icon" width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
