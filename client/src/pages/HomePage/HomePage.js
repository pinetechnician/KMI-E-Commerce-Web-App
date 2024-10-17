import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
import CategoriesCarousel from '../../components/CategoriesCarousel/CategoriesCarousel';
import styles from './HomePage.module.css';

const HomePage = () => {


    return (
        <div className={styles.homePage} >
            <BannerCarousel />
            <h1>Featured Categories</h1>
            <CategoriesCarousel />
        </div>
    );
};

export default HomePage;