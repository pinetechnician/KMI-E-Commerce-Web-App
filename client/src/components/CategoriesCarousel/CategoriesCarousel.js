import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './CategoriesCarousel.module.css';

const CategoriesCarousel = () => {
    const categories = [
        { name: 'Christmas', img: 'https://www.floralkmi.com/categories/IMG_0132chr.jpg' },
        { name: 'Fall', img: 'https://www.floralkmi.com/categories/IMG_0236.jpg' },
        { name: 'Bells & Stars', img: 'https://www.floralkmi.com/categories/4424FA_581cd73b1b54c.jpg' },
        { name: 'Berries & Others', img: 'https://www.floralkmi.com/categories/4351cl_br_cr_51af87b5d152e.jpg' },
        { name: 'Easter', img: 'https://www.floralkmi.com/categories/4367B_PI_CR_52d71ff12577a1.jpg'},
        { name: 'Rice Berries', img: 'https://www.floralkmi.com/categories/4254re_564119554ab15.jpg'},
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsPerSlide = 3;

    const totalSlides = Math.ceil(categories.length / itemsPerSlide);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
    };

    const translateX = -currentIndex * 100; // Move the wrapper by 100% of the container width for each slide

    return (
        <div className={styles.wrapper}>
            <h1>Featured Categories</h1>
        <div className={styles.carouselContainer} >
            <div className={styles.arrow} onClick={goToPrevious} >
                &#8592;
            </div>

            <div className={styles.carouselInner} style={{ transform: `translateX(${translateX}%)` }}>
                {categories.map((category, index) => (
                    <div
                    key={index}
                    className={styles.carouselItem}
                    >
                        <Link to={`/category/${encodeURIComponent(category.name)}`} >
                            <div className={styles.itemBox} >
                                <img src={category.img} alt={category.name} />
                                <h3>{category.name}</h3>
                            </div>
                        </Link>
                  </div>
                ))}
            </div>

            <div className={styles.arrow} onClick={goToNext}>
                &#8594;
            </div>
        </div>
        </div>
    );
};

export default CategoriesCarousel;