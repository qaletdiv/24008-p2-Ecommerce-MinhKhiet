"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { assets } from '../../../assets/assets';
import '../../../styles/Account.css';

const OrdersPage = () => {
  const { 
    user, 
    currency, 
    router, 
    fetchUserOrders 
  } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 5
  });
  const ordersPerPage = 5;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadUserOrders();
  }, [user, router]);

  useEffect(() => {
    if (allOrders.length > 0) {
      setPagination(calculatePagination(allOrders.length));
      setOrders(getCurrentPageOrders(allOrders));
    }
  }, [currentPage, allOrders]);

  const calculatePagination = (totalOrders) => {
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    return {
      totalPages,
      totalItems: totalOrders,
      currentPage,
      itemsPerPage: ordersPerPage
    };
  };

  const getCurrentPageOrders = (allOrders) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return allOrders.slice(startIndex, endIndex);
  };

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
        console.log('✅ Processing real orders in My Orders page...');
        
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
        
        console.log('✅ My Orders page - mapped orders:', mappedOrders.map(order => ({
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
        console.log('📝 No real orders found, using mock orders for My Orders demonstration');
        
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
            <h1 className="account-title">My Orders</h1>
            <p className="account-subtitle">Track and manage your orders</p>
          </div>

          <div className="account-content">
            <div className="account-main-content">
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
                      {orders.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div className="order-info">
                              <h3>Order #{order.orderNumber || 'Unknown'}</h3>
                                <p className="order-date">
                                  {order.date ? new Date(order.date).toLocaleDateString() : 'Date unavailable'}
                                </p>
                            </div>
                            <div className="order-status">
                              <span 
                                className="status-badge"
                                style={{
                                  color: getStatusColor(order.status),
                                  backgroundColor: getStatusBg(order.status)
                                }}
                              >
                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
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
                                      console.log('✅ My Orders - Image loaded:', item.name);
                                    }}
                                    onError={(e) => {
                                      console.log('❌ My Orders - Image failed:', item.name, item.image);           
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
                                    title={item.name}
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
                      ))}
                      
                      {pagination.totalPages > 1 && (
                        <div className="pagination-container">
                          <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                          
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                            disabled={currentPage === pagination.totalPages}
                          >
                            Next
                          </button>
                          
                          <span className="pagination-info">
                            Page {pagination.currentPage} of {pagination.totalPages} 
                            ({pagination.totalItems} total orders)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
                          console.log('✅ My Orders Modal - Image loaded:', item.name);
                        }}
                        onError={(e) => {
                          console.log('❌ My Orders Modal - Image failed:', item.name);
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

export default OrdersPage;