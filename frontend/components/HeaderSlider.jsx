import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import "../styles/HeaderSlider.css";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="slider-container">
      <div
        className="slider-wrapper"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="slider-slide"
          >
            <div className="slider-content">
              <p className="slider-offer">{slide.offer}</p>
              <h1 className="slider-title">
                {slide.title}
              </h1>
              <div className="slider-buttons">
                <button className="slider-button-primary" suppressHydrationWarning={true}>
                  {slide.buttonText1}
                </button>
                <button className="slider-button-secondary" suppressHydrationWarning={true}>
                  {slide.buttonText2}
                  <Image className="slider-arrow-icon" src={assets.arrow_icon} alt="arrow_icon" width={16} height={16} />
                </button>
              </div>
            </div>
            <div className="slider-image-container">
              <Image
                className="slider-image"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                width={500}
                height={400}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`slider-dot ${
              currentSlide === index ? "active" : "inactive"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
