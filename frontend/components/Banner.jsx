import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import "../styles/Banner.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <Image
        className="banner-image-left"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
        width={400}
        height={300}
      />
      <div className="banner-content">
        <h2 className="banner-title">
          Level Up Your Gaming Experience
        </h2>
        <p className="banner-description">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button className="banner-button" suppressHydrationWarning={true}>
          Buy now
          <Image className="banner-arrow-icon" src={assets.arrow_icon_white} alt="arrow_icon_white" width={16} height={16} />
        </button>
      </div>
      <Image
        className="banner-image-right-lg"
        src={assets.md_controller_image}
        alt="md_controller_image"
        width={300}
        height={200}
      />
      <Image
        className="banner-image-right-sm"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
        width={250}
        height={180}
      />
    </div>
  );
};

export default Banner;