// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession } from '../redux/auth/authSlice';
import { fetchCart } from '../redux/currentCart/currentCart';
import { logoutFromServer } from '../api/api';
import { logout } from '../redux/auth/authSlice';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import NavBar from '../components/Navbar/NavBar';
import Login from '../pages/LoginPage/LoginPage';
import Profile from '../pages/ProfilePage/ProfilePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Cart from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation';
import OrdersPage from '../pages/OrdersPage/OrdersPage';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import { useNavigate } from 'react-router-dom'; 
import styles from './App.module.css';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const {loading, isLoggedIn} = useSelector((state) => state.auth);
  const cartItemCount = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate(); // Use navigate inside the Router

  useEffect(() => {
    dispatch(checkSession());
    console.log("session check App.js: ", isLoggedIn);
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logoutFromServer(); // Call the server to log out
      dispatch(logout());       // Update Redux state to log out
      navigate('/login');       // Redirect to login after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <NavBar 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
      />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart isLoggedIn={isLoggedIn} />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </>
  );
};

// Top-level component where you wrap everything inside Router
const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
