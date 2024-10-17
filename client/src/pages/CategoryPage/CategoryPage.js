import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts, searchProducts } from '../../redux/products/productsSlice';  // Path might differ
import { fetchCategories } from '../../redux/categories/categoriesSlice';
import styles from './CategoryPage.module.css';  // Assuming you will add some styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const CategoryPage = () => {
    const { categoryName } = useParams();
    const category = decodeURIComponent(categoryName);
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    //const [searchTerm, setSearchTerm] = useState('');

    // Fetch products when the selected category changes
    useEffect(() => {
        if (category === 'Christmas') {
            dispatch(fetchProducts(27));
        } else if (category === 'Fall') {
            dispatch(fetchProducts(22));
        } else if (category === 'Bells & Stars') {
            dispatch(fetchProducts(2));
        } else if (category === 'Berries & Others') {
            dispatch(fetchProducts(8));
        } else if (category === 'Easter') {
            dispatch(fetchProducts(5));
        } else if (category === 'Rice Berries') {
            dispatch(fetchProducts(3));
        }
    }, [category]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productsPage}>
        <h1>{category}</h1>

        <div className={styles.productsGrid}>
            {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
                <Link to={`/products/${product.id}`}>
                    <img src='https://www.floralkmi.com/sections/2478aor-re-bk-br.jpg' alt={product.name} />
                    <h2>{product.description}</h2>
                </Link>
                <p>{product.item_number}</p>
                <p>${product.price1}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default CategoryPage;