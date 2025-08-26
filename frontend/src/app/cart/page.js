"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { assets } from '../../../assets/assets';
import '../../../styles/Cart.css';

const CartPage = () => {
  const { 
    cart, 
    user, 
    currency, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    getCartAmount, 
    router 
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', '/cart');
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some items before checkout.');
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-loading">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="cart-page">
      <Navbar />
      
      <main className="cart-main">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
            {cart.length > 0 && (
              <button onClick={handleClearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-content">
                <img src={assets.cart_icon} alt="Empty Cart" className="empty-cart-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button onClick={handleContinueShopping} className="continue-shopping-btn">
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                <div className="cart-items-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span>Action</span>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                      <img 
                        src={item.image[0]} 
                        alt={item.name}
                        className="cart-item-image"
                        onClick={() => router.push(`/product/${item.id}`)}
                      />
                      <div className="cart-item-details">
                        <h3 
                          className="cart-item-name"
                          onClick={() => router.push(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="cart-item-category">{item.category}</p>
                        {item.brand && (
                          <p className="cart-item-brand">Brand: {item.brand}</p>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <span className="current-price">{currency}{item.offerPrice}</span>
                      {item.price !== item.offerPrice && (
                        <span className="original-price">{currency}{item.price}</span>
                      )}
                    </div>

                    <div className="cart-item-quantity">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="quantity-btn decrease"
                          disabled={item.quantity <= 1}
                        >
                          <img src={assets.decrease_arrow} alt="decrease" />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="quantity-btn increase"
                        >
                          <img src={assets.increase_arrow} alt="increase" />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      {currency}{(item.offerPrice * item.quantity).toFixed(2)}
                    </div>

                    <div className="cart-item-action">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            
              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Items ({cart.length}):</span>
                      <span>{currency}{getCartAmount().toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span className="free-shipping">Free</span>
                    </div>
                    
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{currency}{getCartAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="summary-actions">
                    <button 
                      onClick={handleCheckout}
                      className="checkout-btn"
                    >
                      Proceed to Checkout
                    </button>
                    
                    <button 
                      onClick={handleContinueShopping}
                      className="continue-shopping-btn secondary"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>

                <div className="shipping-info">
                  <h4>Free Shipping</h4>
                  <p>Enjoy free shipping on all orders. No minimum purchase required!</p>
                </div>

                <div className="security-info">
                  <h4>Secure Checkout</h4>
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          )}

          <div className="cart-navigation">
            <Link href="/" className="nav-link">
              ← Continue Shopping
            </Link>
            {cart.length > 0 && (
              <Link href="/checkout" className="nav-link checkout-link">
                Proceed to Checkout →
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;