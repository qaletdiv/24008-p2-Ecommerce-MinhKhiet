"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { assets } from '../../../assets/assets';
import '../../../styles/Account.css';

const AccountPage = () => {
  const { 
    user, 
    currency, 
    router, 
    logoutUser, 
    fetchUserOrders 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [memberSinceDate, setMemberSinceDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 3
  });
  const ordersPerPage = 3;
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();
    setMemberSinceDate(createdDate.toLocaleDateString());

    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address && typeof user.address === 'object' 
        ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zipCode || ''}, ${user.address.country || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').replace(/\s+/g, ' ').trim()
        : user.address || ''
    });

    loadUserOrders();
  }, [user, router]);

  const calculatePagination = (totalOrders) => {
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    return {
      totalPages,
      totalItems: totalOrders,
      currentPage,
      itemsPerPage: ordersPerPage
    };
  };

  const getCurrentPageOrders = (allOrdersList) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return allOrdersList.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (allOrders.length > 0) {
      setPagination(calculatePagination(allOrders.length));
      setOrders(getCurrentPageOrders(allOrders));
    }
  }, [currentPage, allOrders]);

  const loadUserOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userOrders = await fetchUserOrders(user.id);
      console.log('🔄 Real orders from backend:', userOrders);
      
      const productMap = {
        1: {
          name: 'Apple AirPods Pro 2nd Gen',
          image: 'http://localhost:4000/assets/apple_earphone_image.png'
        },
        2: {
          name: 'ASUS Gaming Laptop',
          image: 'http://localhost:4000/assets/asus_laptop_image.png'
        },
        3: {
          name: 'Bose QuietComfort 45 Headphones',
          image: 'http://localhost:4000/assets/bose_headphone_image.png'
        },
        4: {
          name: 'Samsung Galaxy S23',
          image: 'http://localhost:4000/assets/samsung_s23phone_image.png'
        },
        5: {
          name: 'Garmin Venu 2 Smartwatch',
          image: 'http://localhost:4000/assets/venu_watch_image.png'
        },
        6: {
          name: 'PlayStation 5 Controller',
          image: 'http://localhost:4000/assets/md_controller_image.png'
        }
      };
      
      if (userOrders && userOrders.length > 0) {
        console.log('✅ Processing real orders with product mapping...');
        
        const mappedOrders = userOrders.map(order => {
          const calculatedTotal = order.items?.reduce((sum, item) => {
            return sum + ((item.price || 0) * (item.quantity || 0));
          }, 0) || 0;
          
          return {
            ...order,
            date: order.date || order.orderDate,
            total: order.totalAmount || order.total || calculatedTotal,
            totalAmount: order.totalAmount || order.total || calculatedTotal,
            items: order.items?.map(item => {
              const productInfo = productMap[item.productId];
              return {
                ...item,
                id: item.productId,
                name: productInfo?.name || `Product ${item.productId}`,
                image: productInfo?.image || 'http://localhost:4000/assets/bose_headphone_image.png'
              };
            }) || []
          };
        });
        
        console.log('✅ Mapped real orders:', mappedOrders.map(order => ({
          orderNumber: order.orderNumber,
          items: order.items.map(item => ({ 
            name: item.name, 
            image: item.image
          }))
        })));
        
        setAllOrders(mappedOrders);
        setPagination(calculatePagination(mappedOrders.length));
        setOrders(getCurrentPageOrders(mappedOrders));
      } else {
        console.log('📝 No real orders found, using mock orders for demonstration');
        
        const mockOrders = [
          {
            id: 1,
            orderNumber: 'ORD-000001',
            date: '2024-01-15',
            status: 'delivered',
            total: 329.99,
            totalAmount: 329.99,
            subtotal: 329.99,
            shipping: 0,
            tax: 0,
            items: [
              {
                id: 1,
                name: 'Bose QuietComfort 45 Headphones',
                price: 329.99,
                quantity: 1,
                image: 'http://localhost:4000/assets/bose_headphone_image.png'
              }
            ],
            shippingInfo: {
              firstName: user?.name?.split(' ')[0] || 'John',
              lastName: user?.name?.split(' ')[1] || 'Doe',
              email: user?.email || 'john.doe@example.com',
              phone: user?.phone || '+84 123 456 789',
              address: '123 Nguyen Hue Street',
              city: 'Ho Chi Minh City',
              state: 'Ho Chi Minh',
              zipCode: '700000',
              country: 'Vietnam'
            },
            paymentMethod: 'Credit Card',
            trackingNumber: 'TRK-001234567'
          }
        ];
        
        setAllOrders(mockOrders);
        setPagination(calculatePagination(mockOrders.length));
        setOrders(getCurrentPageOrders(mockOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address && typeof user.address === 'object' 
          ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zipCode || ''}, ${user.address.country || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').replace(/\s+/g, ' ').trim()
          : user.address || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    alert('Profile update functionality would be implemented here.');
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to log out?')) {
      logoutUser();
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#718096';
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#22543d';
      case 'shipped':
        return '#2b6cb0';
      case 'processing':
        return '#d69e2e';
      case 'cancelled':
        return '#c53030';
      default:
        return '#718096';
    }
  };

  const getStatusBg = (status) => {
    if (!status) return '#edf2f7';
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#c6f6d5';
      case 'shipped':
        return '#bee3f8';
      case 'processing':
        return '#faf089';
      case 'cancelled':
        return '#fed7d7';
      default:
        return '#edf2f7';
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      const orderNumber = order.orderNumber || 'Unknown';
      const itemsText = order.items.map(item => {
        const itemName = item.name || 'Unknown Item';
        const itemQuantity = item.quantity || 0;
        return `- ${itemName} (Qty: ${itemQuantity})`;
      }).join('\n');
      
      alert(`Items from Order #${orderNumber} would be added to your cart:\n\n${itemsText}`);
    } else {
      alert('No items found in this order.');
    }
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="account-page">
      <Navbar />
      
      <main className="account-main">
        <div className="account-container">
          
          <div className="account-header">
            <h1 className="account-title">My Account</h1>
            <p className="account-subtitle">Welcome back, {user?.name || 'User'}!</p>
          </div>

          <div className="account-content">
            
            <div className="account-sidebar">
              <div className="sidebar-card">
                <div className="user-info">
                  <div className="user-avatar">
                    <img src={assets.user_icon} alt="User" className="avatar-icon" />
                  </div>
                  <div className="user-details">
                    <h3>{user?.name || 'User'}</h3>
                    <p>{user?.email || 'No email provided'}</p>
                  </div>
                </div>

                <nav className="account-nav">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  >
                    <img src={assets.user_icon} alt="Profile" className="nav-icon" />
                    Profile Information
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  >
                    <img src={assets.order_icon} alt="Orders" className="nav-icon" />
                    Order History
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                  >
                    <img src={assets.my_location_image} alt="Addresses" className="nav-icon" />
                    Saved Addresses
                  </button>
                  
                  <button onClick={handleLogout} className="nav-item logout">
                    <img src={assets.arrow_icon} alt="Logout" className="nav-icon logout-icon" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            <div className="account-main-content">
              
              {activeTab === 'profile' && (
                <div className="content-card">
                  <div className="card-header">
                    <h2>Profile Information</h2>
                    <button onClick={handleEditToggle} className="edit-btn">
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="profile-content">
                    {!isEditing ? (
                      <div className="profile-view">
                        <div className="profile-field">
                          <label>Full Name</label>
                          <p>{user.name || 'Not provided'}</p>
                        </div>
                        
                        <div className="profile-field">
                          <label>Email Address</label>
                          <p>{user.email}</p>
                        </div>
                        
                        <div className="profile-field">
                          <label>Phone Number</label>
                          <p>{user.phone || 'Not provided'}</p>
                        </div>
                        
                        <div className="profile-field">
                          <label>Address</label>
                          <p>
                            {user.address && typeof user.address === 'object' 
                              ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zipCode || ''}, ${user.address.country || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').replace(/\s+/g, ' ').trim() || 'Not provided'
                              : user.address || 'Not provided'
                            }
                          </p>
                        </div>
                        
                        <div className="profile-field">
                          <label>Member Since</label>
                          <p>{memberSinceDate || 'Loading...'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-edit">
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="address">Address</label>
                          <textarea
                            id="address"
                            name="address"
                            value={editFormData.address}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Enter your address"
                            rows="3"
                          />
                        </div>

                        <div className="edit-actions">
                          <button onClick={handleSaveProfile} className="save-btn">
                            Save Changes
                          </button>
                          <button onClick={handleEditToggle} className="cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="content-card">
                  <div className="card-header">
                    <h2>Order History</h2>
                    <span className="orders-count">{allOrders.length} orders</span>
                  </div>

                  <div className="orders-content">
                    {isLoading ? (
                      <div className="loading-state">
                        <p>Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="empty-state">
                        <img src={assets.box_icon} alt="No orders" className="empty-icon" />
                        <h3>No orders yet</h3>
                        <p>When you place your first order, it will appear here.</p>
                        <button onClick={() => router.push('/')} className="shop-now-btn">
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="orders-list">
                        {orders.map(order => {
                          console.log('🔍 RENDERING ORDER:', order.orderNumber);
                          console.log('   → Order items:', order.items);
                          console.log('   → First item:', JSON.stringify(order.items[0], null, 2));
                          console.log('Order:', order.orderNumber, 'Total:', order.total, 'TotalAmount:', order.totalAmount);
                          console.log('Expression result:', ((order.total || order.totalAmount) || 0));
                          
                          return (
                          <div key={order.id} className="order-card">
                            <div className="order-header">
                              <div className="order-info">
                                <h3>Order #{order.orderNumber || 'Unknown'}</h3>
                                <p className="order-date">{new Date(order.date || order.orderDate || Date.now()).toLocaleDateString()}</p>
                              </div>
                              <div className="order-status">
                                <span 
                                  className="status-badge"
                                  style={{
                                    color: getStatusColor(order.status),
                                    backgroundColor: getStatusBg(order.status)
                                  }}
                                >
                                  {(order.status || 'unknown').charAt(0).toUpperCase() + (order.status || 'unknown').slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="order-items">
                              {(order.items || []).map((item, index) => (
                                <div key={index} className="order-item">
                                  <div className="item-image-container">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="item-image"
                                      onLoad={() => {
                                        console.log('✅ Image loaded:', item.name || 'UNKNOWN ITEM');
                                        console.log('   → Item data:', JSON.stringify(item, null, 2));
                                      }}
                                      onError={(e) => {
                                        console.log('❌ Image failed:', item.name || 'UNKNOWN ITEM', item.image);
                                        console.log('   → Full item data:', JSON.stringify(item, null, 2));
                                        const canvas = document.createElement('canvas');
                                        canvas.width = 60;
                                        canvas.height = 60;
                                        const ctx = canvas.getContext('2d');
                                        ctx.fillStyle = '#ea580c';
                                        ctx.fillRect(0, 0, 60, 60);
                                        ctx.fillStyle = 'white';
                                        ctx.font = 'bold 24px Arial';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        const displayName = item.name || 'Unknown';
                                        ctx.fillText(displayName.charAt(0).toUpperCase(), 30, 30);
                                        e.target.src = canvas.toDataURL();
                                      }}
                                      style={{
                                        display: 'block',
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '2px solid #e2e8f0',
                                        backgroundColor: '#f8fafc'
                                      }}
                                    />
                                  </div>
                                  <div className="item-details">
                                    <h4 className="item-name" title={item.name}>
                                      {item.name}
                                    </h4>
                                    <div className="item-price-info">
                                      <span className="item-quantity">Qty: {item.quantity || 0}</span>
                                      <span className="item-separator"> × </span>
                                      <span className="item-unit-price">{currency}{(item.price || 0).toFixed(2)}</span>
                                      <span className="item-line-total"> = {currency}{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="order-footer">
                              <div className="order-total">
                                <strong>Total: {currency}{((order.total || order.totalAmount) || 0).toFixed(2)}</strong>
                              </div>
                              <div className="order-actions">
                                <button 
                                  className="view-details-btn"
                                  onClick={() => handleViewOrderDetails(order)}
                                >
                                  View Details
                                </button>
                                {order.status === 'delivered' && (
                                  <button 
                                    className="reorder-btn"
                                    onClick={() => handleReorder(order)}
                                  >
                                    Reorder
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="content-card">
                  <div className="card-header">
                    <h2>Saved Addresses</h2>
                    <button className="add-address-btn">Add New Address</button>
                  </div>

                  <div className="addresses-content">
                    <div className="empty-state">
                      <img src={assets.my_location_image} alt="No addresses" className="empty-icon" />
                      <h3>No saved addresses</h3>
                      <p>Add your delivery addresses to make checkout faster.</p>
                      <button className="add-address-btn">Add Address</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={closeOrderModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-section">
                <h3>📋 Order Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Order Number:</label>
                    <span>{selectedOrder.orderNumber || 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Order Date:</label>
                    <span>{selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className="status-badge" style={{
                      color: getStatusColor(selectedOrder.status),
                      backgroundColor: getStatusBg(selectedOrder.status)
                    }}>
                      {(selectedOrder.status || 'unknown').charAt(0).toUpperCase() + (selectedOrder.status || 'unknown').slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Method:</label>
                    <span>{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="detail-item">
                      <label>Tracking Number:</label>
                      <span>{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.shippingInfo && (
                <div className="order-details-section">
                  <h3>🚚 Shipping Information</h3>
                  <div className="shipping-details">
                    <div className="customer-info">
                      <h4>Customer Details</h4>
                      <p><strong>Name:</strong> {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                      <p><strong>Email:</strong> {selectedOrder.shippingInfo.email}</p>
                      <p><strong>Phone:</strong> {selectedOrder.shippingInfo.phone}</p>
                    </div>
                    <div className="address-info">
                      <h4>Delivery Address</h4>
                      <p>{selectedOrder.shippingInfo.address}</p>
                      <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zipCode}</p>
                      <p>{selectedOrder.shippingInfo.country}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="order-details-section">
                <h3>🛍️ Items Ordered</h3>
                <div className="modal-order-items">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="modal-order-item">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="modal-item-image"
                        onLoad={() => {
                          console.log('✅ Modal image loaded:', item.name);
                        }}
                        onError={(e) => {
                          console.log('❌ Modal image failed:', item.name);
                          const canvas = document.createElement('canvas');
                          canvas.width = 60;
                          canvas.height = 60;
                          const ctx = canvas.getContext('2d');
                          ctx.fillStyle = '#ea580c';
                          ctx.fillRect(0, 0, 60, 60);
                          ctx.fillStyle = 'white';
                          ctx.font = 'bold 24px Arial';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(item.name.charAt(0).toUpperCase(), 30, 30);
                          e.target.src = canvas.toDataURL();
                        }}
                      />
                      <div className="modal-item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity || 0}</p>
                        <p>Unit Price: {currency}{(item.price || 0).toFixed(2)}</p>
                      </div>
                      <div className="modal-item-total">
                        {currency}{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details-section">
                <h3>💰 Order Summary</h3>
                <div className="order-summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{currency}{(selectedOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{currency}{(selectedOrder.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>{currency}{(selectedOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span><strong>Total:</strong></span>
                    <span><strong>{currency}{((selectedOrder.total || selectedOrder.totalAmount) || 0).toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={closeOrderModal}>Close</button>
              {selectedOrder.status === 'delivered' && (
                <button 
                  className="modal-btn primary" 
                  onClick={() => {
                    handleReorder(selectedOrder);
                    closeOrderModal();
                  }}
                >
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AccountPage;