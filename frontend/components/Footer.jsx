import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-logo-section">
          <Image
            className="footer-logo"
            src={assets.logo}
            alt="logo"
            width={120}
            height={40}
          />
          <p className="footer-description">
            Welcome to QuickCart, your premier destination for the
            latest and most reliable electronics. Since our founding, we've been
            committed to providing cutting-edge technology from smartphones and
            laptops to smart home devices and audio gear. We carefully select
            every product to ensure it meets our high standards for innovation,
            quality, and value, helping you stay connected and empowered in a
            digital world.
          </p>
        </div>

        <div className="footer-section">
          <div>
            <h2 className="footer-section-title">Company</h2>
            <ul className="footer-nav-list">
              <li>
                <a className="footer-nav-link" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="footer-nav-link" href="#">
                  Privacy policy
                </a>
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
