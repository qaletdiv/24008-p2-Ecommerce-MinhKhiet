import { useAppContext } from "../context/AppContext";
import React, { useEffect, useState } from "react";
import "../styles/OrderSummary.css";
import { addressDummyData } from "../assets/assets";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, cart, user, createOrder: createOrderAPI } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.offerPrice || item.price,
          quantity: item.quantity,
          total: (item.offerPrice || item.price) * item.quantity
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          street: selectedAddress.area,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode || '00000',
          country: selectedAddress.country || 'USA',
          phone: selectedAddress.phone || user.phone || ''
        },
        paymentMethod: 'credit_card',
        notes: 'Order placed from website'
      };

      const response = await createOrderAPI(orderData);
      
      if (response.success) {
        const orderNumber = response.data?.orderNumber || response.data?.id || 'N/A';
        alert(`Order placed successfully! Order ID: ${orderNumber}`);
        router.push('/orders');
      } else {
        alert(`Failed to place order: ${response.error}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
    <div className="order-summary-container">
      <h2 className="order-summary-title">
        Order Summary
      </h2>
      <hr className="order-summary-divider" />
      <div className="order-summary-content">
        <div>
          <label className="address-section">
            Select Address
          </label>
          <div className="address-dropdown">
            <button
              className="address-dropdown-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`dropdown-arrow ${isDropdownOpen ? "open" : "closed"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="dropdown-menu">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="dropdown-add-new"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="promo-section">
          <label className="address-section">
            Promo Code
          </label>
          <div className="promo-section">
            <input
              type="text"
              placeholder="Enter promo code"
              className="promo-input"
            />
            <button className="promo-button">
              Apply
            </button>
          </div>
        </div>

        <hr className="order-summary-divider" />

        <div className="order-details">
          <div className="order-detail-item">
            <p className="order-detail-label items">Items {getCartCount()}</p>
            <p className="order-detail-value">{currency}{getCartAmount()}</p>
          </div>
          <div className="order-detail-item">
            <p className="order-detail-label shipping">Shipping Fee</p>
            <p className="order-detail-value">Free</p>
          </div>
          <div className="order-detail-item">
            <p className="order-detail-label tax">Tax (2%)</p>
            <p className="order-detail-value">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="order-total">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="place-order-button">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;