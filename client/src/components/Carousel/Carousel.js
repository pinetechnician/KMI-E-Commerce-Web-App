import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from './Carousel.module.css';

const Carousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsPerSlide = 3;

    const totalSlides = Math.ceil(products.length / itemsPerSlide);

    const goToPrevious = () => {
        /*const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? products.length -1 : currentIndex - 1;
        setCurrentIndex(newIndex);*/
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        /*const isLastSlide = currentIndex === products.length -1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);*/
        setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
    };

    const translateX = -currentIndex * 100; // Move the wrapper by 100% of the container width for each slide

    return (
        <div className={styles.carouselContainer} >
            <div className={styles.arrow} onClick={goToPrevious} >
                &#8592;
            </div>

            <div className={styles.carouselInner} style={{ transform: `translateX(${translateX}%)` }}>
                {products.map((product, index) => (
                    <div
                    key={index}
                    className={styles.carouselItem}
                    >
                    <img src='https://www.floralkmi.com/categories/4367B_PI_CR_52d71ff12577a1.jpg' alt={product.description} />
                    <h3>{product.description}</h3>
                    <h4>{product.item_number}</h4>
                  </div>
                ))}
            </div>

            <div className={styles.arrow} onClick={goToNext}>
                &#8594;
            </div>
        </div>
    );
};

export default Carousel;