import React, { useState, useEffect } from 'react';
import styles from './BannerCarousel.module.css'; // Import the relevant styles

const images = [
  { src: 'https://www.floralkmi.com/slider/2024-webbanner-fall.jpg', alt: 'Banner 1' },
  { src: 'https://www.floralkmi.com/slider/2024-webbanner-season.jpg', alt: 'Banner 2' },
  //{ src: 'image3.jpg', alt: 'Banner 3' },
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(slideInterval); // Cleanup on unmount
  }, [currentSlide]);

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carouselWrapper}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div className={styles.carouselItem} key={index}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;