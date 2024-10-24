import React from "react";
import { Link } from "react-router-dom";
import styles from './ProductCard.module.css';

const ProductCard = ({product, mainImage}) => {
    //console.log(product);
    //const mainImage = product[0].images.find(img => img.image_type === 'closeup') || 
                                      //  product[0].images.find(img => img.image_type === 'main') ||
                                      //  product[0].images[0]; // Fallback to the first image if none match
    return (
        <>
                <div key={product.id} className={styles.productCard}>
                    <Link to={`/products/${product.id}`}>
                    <img 
                    src={
                        mainImage ? 
                        mainImage.image_url : 
                        'https://user-images.githubusercontent.com/5671907/174857173-c3351777-14f1-4e12-bcb4-f46693f9dbe0.png'
                        } 
                    alt={product.description} 
                    />
                        <h2>{product.description}</h2>
                    </Link>
                    <p>{product.itemNumber}</p>
                    <p>${product.price1}</p>
                </div>
        </>
    );
};

export default ProductCard;