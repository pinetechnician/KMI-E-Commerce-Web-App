import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
import CategoriesCarousel from '../../components/CategoriesCarousel/CategoriesCarousel';
import styles from './HomePage.module.css';

const HomePage = () => {


    return (
        <div className={styles.homePage} >
            <div className={styles.bannerWrapper} >
                <BannerCarousel />
            </div>
            <div className={styles.mainWrapper} >
                <CategoriesCarousel />
            </div>
        </div>
    );
};

export default HomePage;