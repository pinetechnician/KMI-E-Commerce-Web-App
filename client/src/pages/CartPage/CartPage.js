import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../redux/currentCart/currentCart';
import styles from './CartPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Cart = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    dispatch(fetchCart());
  };

  const handleShoppingClick = () => {
    navigate('/');
  }

  const handleCheckoutClick = () => {
    navigate('/checkout');
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {totalQuantity === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div  >
          <div className={styles.mainSection}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
				          <th>Quantity</th>
				          <th>Subtotal</th>
				          <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  item.itemId ? (
                    <tr className={styles.itemCard}>
                      <td>
					              <p>{item.itemNumber}</p>
					              <h4>{item.productName}</h4>
				              </td>
                      <td>${item.unitPrice}</td>
				              <td>{item.quantity}</td>
				              <td>${item.unitPrice * item.quantity}</td>
				              <td>
					              <button onClick={() => handleRemoveFromCart(item.itemId)}>
                  		    <FontAwesomeIcon icon={faTrash} />
                		    </button>
				              </td>
                    </tr>
                  ) : null
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><strong>Total: ${totalAmount.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <div className={styles.buttonContainer} >
              <button onClick={handleShoppingClick} className={styles.shopButton} >
                continue shopping
              </button>
              {isLoggedIn && (
                <button onClick={handleCheckoutClick} className={styles.checkoutButton} >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;