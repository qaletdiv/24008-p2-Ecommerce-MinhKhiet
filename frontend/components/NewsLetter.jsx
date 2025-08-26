import React from "react";
import "../styles/NewsLetter.css";

const NewsLetter = () => {
  return (
    <div className="newsletter-container">
      <h1 className="newsletter-title">
        Subscribe now & get 20% off
      </h1>
      <p className="newsletter-description">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <div className="newsletter-form">
        <input
          className="newsletter-input"
          type="text"
          placeholder="Enter your email id"
          suppressHydrationWarning={true}
        />
        <button className="newsletter-button" suppressHydrationWarning={true}>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
