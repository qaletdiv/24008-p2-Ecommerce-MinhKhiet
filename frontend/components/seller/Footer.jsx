import React from "react";
import Image from "next/image";
import "../../styles/SellerFooter.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="seller-footer-container">
      <div className="seller-footer-left">
        <Image className="seller-footer-logo" src={assets.logo} alt="logo" width={120} height={40} />
        <div className="seller-footer-divider"></div>
        <p className="seller-footer-copyright">
          Copyright 2025 © ALex.dev All Right Reserved.
        </p>
      </div>
      <div className="seller-footer-social">
        <a href="#">
          <Image src={assets.facebook_icon} alt="facebook_icon" width={24} height={24} />
        </a>
        <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" width={24} height={24} />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" width={24} height={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;