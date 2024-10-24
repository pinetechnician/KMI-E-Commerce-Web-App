import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, searchProducts } from '../../redux/products/productsSlice';
import { addToCart } from '../../redux/currentCart/currentCart';
import ProductCard from '../../components/ProductCard/ProductCard';
import Carousel from '../../components/Carousel/Carousel';
import styles from './ProductDetails.module.css'; // Assuming you will add some styles

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, products, loading, error } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState();
    //console.log('product: ', product);
    const itmNum = product ? product[0].item_number.slice(0, 4) : null;
    //console.log('search Number: ', itmNum);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (product && product[0]) {
            // Find the main image once product data is fetched
            const foundMainImage = product[0].images.find(img => img.image_type === 'main') ||
                                   product[0].images.find(img => img.image_type === 'closeup') ||
                                   product[0].images[0]; // Fallback

            setMainImage(foundMainImage);
            setQuantity(product[0].qty1);  // Set initial quantity to qty1
        }
    }, [product]);


    useEffect(() => {
        if (product && product[0]) {
            setQuantity(product[0].qty1);  // Set the initial quantity to qty1
        }
    }, [product]);
    
    useEffect(() => {
        if(itmNum) {
            dispatch(searchProducts(itmNum));
            console.log('searched products: ', products);
        }
    }, [itmNum]);

    const handleBlur = () => {
        if (product && product[0] && quantity < product[0].qty1) {
            setQuantity(product[0].qty1);  // Ensure the minimum quantity is respected
        }
    };

    const handleAddToCart = () => {
        const finalQuantity = Math.max(quantity, product[0].qty1);
        dispatch(addToCart({ productId: product[0].id, quantity: finalQuantity }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productDetails}>
            {product ? (
                <>
                    <h1>{product[0].description}</h1>
                    <img src={
                        mainImage ? 
                        mainImage.image_url : 
                        'https://user-images.githubusercontent.com/5671907/174857173-c3351777-14f1-4e12-bcb4-f46693f9dbe0.png'
                        } 
                        alt={product.item_number} 
                    />
                    <p>Item Number: {product[0].item_number}</p>
                    {product[0].availability ? <p>Availability: Sold Out</p> : <p>Availability: In stock</p>}
                    <table className={styles.pricingTable}>
                        <thead>
                            <tr>
                                <th>Price per unit</th>
                                <th>Minimum Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product[0].price1 && product[0].qty1 && (
                                <tr>
                                    <td>${product[0].price1}</td>
                                    <td>{product[0].qty1}</td>
                                </tr>
                            )}
                            {product[0].price2 && product[0].qty2 && (
                                <tr>
                                    <td>${product[0].price2}</td>
                                    <td>{product[0].qty2}</td>
                                </tr>
                            )}
                            {product[0].price3 && product[0].qty3 && (
                                <tr>
                                    <td>${product[0].price3}</td>
                                    <td>{product[0].qty3}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <label htmlFor="quantity">Select Quantity:</label>
                    {product[0].qty1 && (
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            min={product[0].qty1} // Minimum quantity is qty1
                            onChange={(e) => setQuantity(Number(e.target.value), product[0].qty1)}  // Ensure the value is not below qty1
                            onBlur={handleBlur}
                        />
                    )}
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    
                    <h2>Related Products</h2>
                    {products.length > 3 ? (
                        <Carousel products={products} />
                    ) : (
                        <div className={styles.productsGrid} >
                            {products.map((pr) => {
                                const mainPic = pr?.images?.find(img => img.image_type === 'closeup') || 
                                pr?.images?.find(img => img.image_type === 'main') ||
                                (pr?.images ? product.images[0] : null); 
                                (<ProductCard product={pr} mainImage={mainPic} />)
                            })}
                        </div>
                    )}
                    
                </>
            ) : (
                <p>Product not found.</p>
            )}
        </div>
    );
};

export default ProductDetails;