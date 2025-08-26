"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import '../../../styles/Checkout.css';

const CheckoutPage = () => {
  const { 
    cart, 
    user, 
    currency, 
    getCartAmount, 
    createOrder, 
    router 
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'USA',
    
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    orderNotes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      router.push('/cart');
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }

    setIsLoading(false);
  }, [user, cart, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    if (!formData.billingSameAsShipping) {
      if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'Billing first name is required';
      if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Billing last name is required';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingState.trim()) newErrors.billingState = 'Billing state is required';
      if (!formData.billingZipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required';
    }

    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.offerPrice,
          quantity: item.quantity,
          image: item.image[0]
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        billingAddress: formData.billingSameAsShipping ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          address: formData.billingAddress,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: getCartAmount(),
        orderNotes: formData.orderNotes
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        sessionStorage.setItem('orderId', response.data.id || Date.now().toString());
        sessionStorage.setItem('orderTotal', getCartAmount().toString());
        sessionStorage.setItem('paymentMethod', formData.paymentMethod);
        sessionStorage.setItem('shippingAddress', JSON.stringify(orderData.shippingAddress));
        sessionStorage.setItem('orderItems', JSON.stringify(orderData.items));
        
        router.push('/order-confirmation');
      } else {
        setErrors({
          submit: response.error || 'Failed to place order. Please try again.'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({
        submit: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-loading">
          <p>Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !cart || cart.length === 0) {
    return null; 
  }

  return (
    <div className="checkout-page">
      <Navbar />
      
      <main className="checkout-main">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1 className="checkout-title">Checkout</h1>
            <div className="breadcrumb">
              <span onClick={() => router.push('/cart')} className="breadcrumb-link">Cart</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Checkout</span>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-content">
              <div className="checkout-forms">
                <div className="form-section">
                  <h2 className="section-title">Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="form-label">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-input ${errors.address ? 'form-input-error' : ''}`}
                      placeholder="Enter street address"
                    />
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="apartment" className="form-label">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                        placeholder="Enter city"
                      />
                      {errors.city && <span className="field-error">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state" className="form-label">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`form-input ${errors.state ? 'form-input-error' : ''}`}
                        placeholder="Enter state"
                      />
                      {errors.state && <span className="field-error">{errors.state}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`form-input ${errors.zipCode ? 'form-input-error' : ''}`}
                        placeholder="Enter ZIP code"
                      />
                      {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <h2 className="section-title">Billing Information</h2>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="billingSameAsShipping"
                        checked={formData.billingSameAsShipping}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Billing address is the same as shipping address</span>
                    </label>
                  </div>

                  {!formData.billingSameAsShipping && (
                    <div className="billing-fields">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="billingFirstName" className="form-label">First Name *</label>
                          <input
                            type="text"
                            id="billingFirstName"
                            name="billingFirstName"
                            value={formData.billingFirstName}
                            onChange={handleInputChange}
                            className={`form-input ${errors.billingFirstName ? 'form-input-error' : ''}`}
                            placeholder="Enter first name"
                          />
                          {errors.billingFirstName && <span className="field-error">{errors.billingFirstName}</span>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="billingLastName" className="form-label">Last Name *</label>
                          <input
                            type="text"
                            id="billingLastName"
                            name="billingLastName"
                            value={formData.billingLastName}
                            onChange={handleInputChange}
                            className={`form-input ${errors.billingLastName ? 'form-input-error' : ''}`}
                            placeholder="Enter last name"
                          />
                          {errors.billingLastName && <span className="field-error">{errors.billingLastName}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h2 className="section-title">Payment Method</h2>
                  
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleInputChange}
                        className="radio-input"
                      />
                      <span className="radio-text">Credit Card</span>
                    </label>
                    
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="radio-input"
                      />
                      <span className="radio-text">PayPal</span>
                    </label>
                    
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleInputChange}
                        className="radio-input"
                      />
                      <span className="radio-text">Cash on Delivery</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="credit-card-fields">
                      <div className="form-group">
                        <label htmlFor="cardNumber" className="form-label">Card Number *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`form-input ${errors.cardNumber ? 'form-input-error' : ''}`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`form-input ${errors.expiryDate ? 'form-input-error' : ''}`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="cvv" className="form-label">CVV *</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`form-input ${errors.cvv ? 'form-input-error' : ''}`}
                            placeholder="123"
                          />
                          {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cardName" className="form-label">Cardholder Name *</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.cardName ? 'form-input-error' : ''}`}
                          placeholder="Name on card"
                        />
                        {errors.cardName && <span className="field-error">{errors.cardName}</span>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h2 className="section-title">Additional Information</h2>
                  
                  <div className="form-group">
                    <label htmlFor="orderNotes" className="form-label">Order Notes (optional)</label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Special instructions for your order..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  
                  <div className="order-items">
                    {cart.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image[0]} alt={item.name} className="order-item-image" />
                        <div className="order-item-details">
                          <h4>{item.name}</h4>
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <div className="order-item-price">
                          {currency}{(item.offerPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>{currency}{getCartAmount().toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="total-row">
                      <span>Tax:</span>
                      <span>{currency}0.00</span>
                    </div>
                    <div className="total-row total">
                      <span>Total:</span>
                      <span>{currency}{getCartAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="place-order-btn"
                  >
                    {isSubmitting ? (
                      <span className="loading-text">
                        <span className="loading-spinner"></span>
                        Placing Order...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;