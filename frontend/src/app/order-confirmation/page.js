"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { assets } from '../../../assets/assets';
import '../../../styles/OrderConfirmation.css';

const OrderConfirmationPage = () => {
  const { user, currency, router } = useAppContext();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const orderId = sessionStorage.getItem('orderId');
    
    if (!orderId) {
      router.push('/');
      return;
    }
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const mockOrderDetails = {
      id: orderId,
      orderNumber: `ORD-${orderId.toString().padStart(6, '0')}`,
      date: currentDate.toLocaleDateString(),
      status: 'confirmed',
      estimatedDelivery: deliveryDate.toLocaleDateString(),
      total: parseFloat(sessionStorage.getItem('orderTotal')) || 0,
      paymentMethod: sessionStorage.getItem('paymentMethod') || 'Credit Card',
      shippingAddress: (() => {
        try {
          const stored = sessionStorage.getItem('shippingAddress');
          if (stored) {
            const parsed = JSON.parse(stored);
            return {
              fullName: String(parsed.fullName || ''),
              firstName: String(parsed.firstName || ''),
              lastName: String(parsed.lastName || ''),
              address: String(parsed.address || ''),
              street: String(parsed.street || ''),
              apartment: String(parsed.apartment || ''),
              city: String(parsed.city || ''),
              state: String(parsed.state || ''),
              zipCode: String(parsed.zipCode || ''),
              country: String(parsed.country || ''),
              phone: String(parsed.phone || '')
            };
          }
          return {};
        } catch (error) {
          console.error('Error parsing shipping address:', error);
          return {};
        }
      })(),
      items: (() => {
        try {
          const stored = sessionStorage.getItem('orderItems');
          return stored ? JSON.parse(stored) : [];
        } catch (error) {
          console.error('Error parsing order items:', error);
          return [];
        }
      })()
    };

    setOrderDetails(mockOrderDetails);
    setIsLoading(false);

    sessionStorage.removeItem('orderId');
    sessionStorage.removeItem('orderTotal');
    sessionStorage.removeItem('paymentMethod');
    sessionStorage.removeItem('shippingAddress');
    sessionStorage.removeItem('orderItems');
  }, [user, router, isMounted]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    router.push('/account');
  };

  const handleDownloadReceipt = () => {
    alert('Receipt download functionality would be implemented here.');
  };

  if (isLoading) {
    return (
      <div className="order-confirmation-page">
        <Navbar />
        <div className="confirmation-loading">
          <p>Loading order confirmation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="order-confirmation-page">
      <Navbar />
      
      <main className="confirmation-main">
        <div className="confirmation-container">
          
          <div className="success-header">
            <div className="success-icon">
              <img src={assets.checkmark} alt="Success" className="checkmark-icon" />
            </div>
            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-message">
              Thank you for your purchase! Your order has been successfully placed and is being processed.
            </p>
          </div>

          {orderDetails && (
            <div className="order-info-section">
              <div className="order-summary-card">
                <h2>Order Summary</h2>
                
                <div className="order-header-info">
                  <div className="order-number">
                    <span className="label">Order Number:</span>
                    <span className="value">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="order-date">
                    <span className="label">Order Date:</span>
                    <span className="value">{orderDetails.date}</span>
                  </div>
                  <div className="order-status">
                    <span className="label">Status:</span>
                    <span className="value status-confirmed">Confirmed</span>
                  </div>
                  <div className="estimated-delivery">
                    <span className="label">Estimated Delivery:</span>
                    <span className="value">{orderDetails.estimatedDelivery}</span>
                  </div>
                </div>

                {orderDetails.items && orderDetails.items.length > 0 && (
                  <div className="order-items-section">
                    <h3>Items Ordered</h3>
                    <div className="items-list">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img 
                            src={item.image || '/default-product.jpg'} 
                            alt={item.name}
                            className="item-image"
                          />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {currency}{item.price}</p>
                          </div>
                          <div className="item-total">
                            {currency}{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="order-total-section">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{currency}{orderDetails.total.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>{currency}0.00</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>{currency}{orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="payment-info">
                  <h3>Payment Method</h3>
                  <p>{orderDetails.paymentMethod}</p>
                </div>

                {orderDetails.shippingAddress && Object.keys(orderDetails.shippingAddress).length > 0 && (
                  <div className="shipping-info">
                    <h3>Shipping Address</h3>
                    <div className="address">
                      {(orderDetails.shippingAddress.firstName || orderDetails.shippingAddress.fullName) && (
                        <p>
                          {orderDetails.shippingAddress.firstName && orderDetails.shippingAddress.lastName 
                            ? `${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}`
                            : orderDetails.shippingAddress.fullName || 'Name not available'
                          }
                        </p>
                      )}
                      {(orderDetails.shippingAddress.address || orderDetails.shippingAddress.street) && (
                        <p>{String(orderDetails.shippingAddress.address || orderDetails.shippingAddress.street)}</p>
                      )}
                      {orderDetails.shippingAddress.apartment && (
                        <p>{String(orderDetails.shippingAddress.apartment)}</p>
                      )}
                      {(orderDetails.shippingAddress.city && orderDetails.shippingAddress.state) && (
                        <p>
                          {String(orderDetails.shippingAddress.city)}, {String(orderDetails.shippingAddress.state)} {String(orderDetails.shippingAddress.zipCode || '')}
                        </p>
                      )}
                      {orderDetails.shippingAddress.country && (
                        <p>{String(orderDetails.shippingAddress.country)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="next-steps-card">
                <h2>What's Next?</h2>
                
                <div className="steps-list">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Order Confirmation</h3>
                      <p>You'll receive an email confirmation shortly with your order details.</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Processing</h3>
                      <p>We'll prepare your items for shipping within 1-2 business days.</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Shipping</h3>
                      <p>Your order will be shipped and you'll receive tracking information.</p>
                    </div>
                  </div>
                  
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Delivery</h3>
                      <p>Estimated delivery: {orderDetails.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <div className="help-info">
                  <h3>Need Help?</h3>
                  <p>
                    If you have any questions about your order, please contact our customer service team.
                  </p>
                  <p>
                    <strong>Email:</strong> pvominhkhiet@gmail.com<br />
                    <strong>Phone:</strong> 0968089840
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={handleContinueShopping} className="continue-shopping-btn">
              Continue Shopping
            </button>
            
            <button onClick={handleViewOrders} className="view-orders-btn">
              View My Orders
            </button>
            
            <button onClick={handleDownloadReceipt} className="download-receipt-btn">
              Download Receipt
            </button>
          </div>

          <div className="additional-info">
            <div className="info-card">
              <h3>Return Policy</h3>
              <p>
                You can return most items within 30 days of delivery for a full refund. 
                Items must be in original condition.
              </p>
            </div>
            
            <div className="info-card">
              <h3>Track Your Order</h3>
              <p>
                Once your order ships, you'll receive a tracking number to monitor 
                your package's progress.
              </p>
            </div>
            
            <div className="info-card">
              <h3>Customer Support</h3>
              <p>
                Our customer service team is available 24/7 to help with any questions 
                or concerns about your order.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;