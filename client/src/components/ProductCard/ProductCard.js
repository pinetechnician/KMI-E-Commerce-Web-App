import React from "react";
import { Link } from "react-router-dom";
import styles from './ProductCard.module.css';

const ProductCard = ({product}) => {
    return (
        <>
                <div key={product.id} className={styles.productCard}>
                    <Link to={`/products/${product.id}`}>
                        <img src='https://www.floralkmi.com/sections/2478aor-re-bk-br.jpg' alt={product.name} />
                        <h2>{product.description}</h2>
                    </Link>
                    <p>{product.itemNumber}</p>
                    <p>${product.price1}</p>
                </div>
        </>
    );
};

export default ProductCard;