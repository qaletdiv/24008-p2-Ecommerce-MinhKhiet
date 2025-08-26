"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import SellerNavbar from '../../components/seller/Navbar';
import SellerSidebar from '../../components/seller/Sidebar';
import SellerFooter from '../../components/seller/Footer';
import Loading from '../../components/Loading';

const SellerDashboard = () => {
  const { 
    products, 
    categories,
    orders,
    fetchProducts, 
    fetchCategories,
    fetchOrders,
    addProduct,
    updateProduct,
    removeProduct,
    loadingStates, 
    loading,
    error,
    user 
  } = useAppContext();

  const [activeSection, setActiveSection] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    category: '',
    brand: '',
    quantity: '',
    image: [''],
    tags: []
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      tags: formData.tags.filter(tag => tag.trim() !== '')
    };

    try {
      let response;
      if (editingProduct) {
        response = await updateProduct(editingProduct.id, productData);
      } else {
        response = await addProduct(productData);
      }

      if (response.success) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        resetForm();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      offerPrice: product.offerPrice.toString(),
      category: product.category,
      brand: product.brand,
      quantity: product.quantity.toString(),
      image: product.image,
      tags: product.tags || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const response = await removeProduct(productId);
      if (response.success) {
        alert('Product deleted successfully!');
      } else {
        alert(`Error: ${response.error}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      offerPrice: '',
      category: '',
      brand: '',
      quantity: '',
      image: [''],
      tags: []
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const dashboardStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  };

  const mainContentStyle = {
    display: 'flex',
    flex: 1
  };

  const contentStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9fafb'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#ea580c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb'
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#ef4444',
    color: 'white'
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    margin: '20px 0',
    textAlign: 'center'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ea580c',
    marginBottom: '5px'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#6b7280'
  };

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return (
      <div style={dashboardStyle}>
        <SellerNavbar />
        <div style={contentStyle}>
          <div style={errorStyle}>
            Access denied. Please login as a seller or admin.
          </div>
        </div>
        <SellerFooter />
      </div>
    );
  }

  return (
    <div style={dashboardStyle}>
      <SellerNavbar />
      <div style={mainContentStyle}>
        <SellerSidebar />
        <div style={contentStyle}>
          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}

          <div style={statsStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{products.length}</div>
              <div style={statLabelStyle}>Total Products</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{categories.length}</div>
              <div style={statLabelStyle}>Categories</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{orders.length}</div>
              <div style={statLabelStyle}>Total Orders</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </div>
              <div style={statLabelStyle}>Total Revenue</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={headerStyle}>
              <h2 style={titleStyle}>Product Management</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)} 
                style={buttonStyle}
              >
                {showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <div style={formStyle}>
                  <div>
                    <label style={labelStyle}>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Offer Price</label>
                    <input
                      type="number"
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                  <button type="button" onClick={resetForm} style={{ ...buttonStyle, backgroundColor: '#6b7280' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loadingStates.products ? (
              <Loading />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Offer Price</th>
                      <th style={thStyle}>Quantity</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td style={tdStyle}>{product.id}</td>
                        <td style={tdStyle}>{product.name}</td>
                        <td style={tdStyle}>{product.category}</td>
                        <td style={tdStyle}>${product.price}</td>
                        <td style={tdStyle}>${product.offerPrice}</td>
                        <td style={tdStyle}>{product.quantity}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={editButtonStyle}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            style={deleteButtonStyle}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div style={cardStyle}>
            <h2 style={titleStyle}>Recent Orders</h2>
            {loadingStates.orders ? (
              <Loading />
            ) : orders.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Order #</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order.id}>
                        <td style={tdStyle}>{order.orderNumber}</td>
                        <td style={tdStyle}>{order.shippingAddress?.fullName || 'N/A'}</td>
                        <td style={tdStyle}>${order.totalAmount || 0}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: order.status === 'delivered' ? '#dcfce7' : 
                                           order.status === 'shipped' ? '#dbeafe' : 
                                           order.status === 'processing' ? '#fef3c7' : '#fee2e2',
                            color: order.status === 'delivered' ? '#16a34a' : 
                                   order.status === 'shipped' ? '#2563eb' : 
                                   order.status === 'processing' ? '#d97706' : '#dc2626'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={tdStyle}>{new Date(order.orderDate || order.date || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
      <SellerFooter />
    </div>
  );
};

export default SellerDashboard;