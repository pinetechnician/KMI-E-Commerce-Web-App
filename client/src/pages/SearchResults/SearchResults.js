import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts } from '../../redux/products/productsSlice';  // Path might differ
import { fetchCategories } from '../../redux/categories/categoriesSlice';
import styles from './SearchResults.module.css';  // Assuming you will add some styles

const SearchResults = () => {
    const { searchQuery } = useParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());  // Fetch categories for the dropdown
    }, []);

    // Fetch products when the selected category changes
    useEffect(() => {
        if (selectedCategoryId !== '') {
            dispatch(fetchProducts(selectedCategoryId));
        } 
    }, [selectedCategoryId]);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
        setSearchTerm('');  // Clear search term when a category is selected
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productsPage}>
            <div className={styles.searchWrapper} >
        <h1>Results for {searchQuery}</h1>
        {/* Category Dropdown */}
        <select value={selectedCategoryId} onChange={handleCategoryChange}>
            <option value=''>All Categories</option>
            {categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
            ))}
        </select>
        </div>
        <div className={styles.productsGrid}>
        {products.map((product) => {
            // Find the main image or fall back to the first available image
            //const mainImage = product.images.find(img => img.image_type === 'closeup') || 
                              //  product.images.find(img => img.image_type === 'main') ||
                               // product.images[0]; // Fallback to the first image if none match

            const mainImage = product?.images?.find(img => img.image_type === 'closeup') || 
                               product?.images?.find(img => img.image_type === 'main') ||
                               (product?.images ? product.images[0] : null);                
            return (
                <div key={product.id} className={styles.productCard}>
                <Link to={`/products/${product.id}`}>
                    <div className={styles.imageWrapper}>
                        <img 
                            src={mainImage ? mainImage.image_url : 'https://user-images.githubusercontent.com/5671907/174857173-c3351777-14f1-4e12-bcb4-f46693f9dbe0.png'} 
                            alt={product.item_number} 
                        />
                    </div>
                    <h2>{product.description}</h2>
                </Link>
                <p>{product.item_number}</p>
                <p>${product.price1}</p>
                </div>
            );
        })}
        </div>
        </div>
    );
};

export default SearchResults;