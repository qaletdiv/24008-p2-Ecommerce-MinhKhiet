import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-logo-section">
          <Image className="footer-logo" src={assets.logo} alt="logo" width={120} height={40} />
          <p className="footer-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="footer-section">
          <div>
            <h2 className="footer-section-title">Company</h2>
            <ul className="footer-nav-list">
              <li>
                <a className="footer-nav-link" href="#">Home</a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">About us</a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">Contact us</a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-section">
          <div>
            <h2 className="footer-section-title">Get in touch</h2>
            <div className="footer-contact-info">
              <p>+84 0968089840</p>
              <p>contact@Alex.dev</p>
            </div>
          </div>
        </div>
      </div>
      <p className="footer-copyright">
        Copyright 2025 © Alex.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;