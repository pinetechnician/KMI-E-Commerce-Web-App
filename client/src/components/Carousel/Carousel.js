import React, { useState } from "react";
import { Link } from "react-router-dom";
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
                {products.map((product, index) => {
                    const mainImage = product?.images?.find(img => img.image_type === 'closeup') || 
                                    product?.images?.find(img => img.image_type === 'main') ||
                                    (product?.images ? product.images[0] : null); 
                    return (
                        <div
                        key={index}
                        className={styles.carouselItem}
                        >
                            <Link to={`/products/${product.id}`} >
                                <div className={styles.itemBox} >
                                    <img src={
                                        mainImage ? 
                                        mainImage.image_url : 
                                        'https://user-images.githubusercontent.com/5671907/174857173-c3351777-14f1-4e12-bcb4-f46693f9dbe0.png'
                                        } 
                                        alt={product.description} 
                                    />
                                    <h3>{product.description}</h3>
                                    <h4>{product.item_number}</h4>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>

            <div className={styles.arrow} onClick={goToNext}>
                &#8594;
            </div>
        </div>
    );
};

export default Carousel;