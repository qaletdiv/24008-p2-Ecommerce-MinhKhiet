"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import Loading from '../../../components/Loading';

const AllProductsPage = () => {
  const { 
    categories, 
    fetchCategories, 
    loadingStates, 
    error,
    apiService 
  } = useAppContext();

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [displayProducts, setDisplayProducts] = useState([]); 
  
  const loadProducts = async () => {
    const params = {
      page: currentPage,
      ...filters
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key];
      }
    });

    console.log('Loading products with params:', params);
    try {
      const response = await apiService.getProducts(params);
      console.log('Fetch products response:', response);
      
      if (response && response.data) {
        console.log('Products loaded:', response.data.length, 'products');
        setDisplayProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        console.log('No products data in response:', response);
        setDisplayProducts([]);
        setPagination({});
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setDisplayProducts([]);
      setPagination({});
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };
  useEffect(() => {
    fetchCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
    loadProducts();
  }, [filters]);
  
  useEffect(() => {
    loadProducts(); 
  }, [currentPage]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const mainStyle = {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  };

  const headerStyle = {
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1f2937'
  };

  const filtersStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const searchFormStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'end'
  };

  const searchButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ea580c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const productsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '40px'
  };

  const pageButtonStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '4px'
  };

  const activePageButtonStyle = {
    ...pageButtonStyle,
    backgroundColor: '#ea580c',
    color: 'white',
    border: '1px solid #ea580c'
  };

  const noProductsStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    margin: '20px 0',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <main style={mainStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            All Products 
            {pagination.totalItems > 0 && (
              <span style={{ fontSize: '18px', fontWeight: '400', color: '#6b7280' }}>
              </span>
            )}
          </h1>
          
          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}
        
          <div style={filtersStyle}>
            <form onSubmit={handleSearch} style={searchFormStyle}>
              <div style={filterGroupStyle}>
                <label style={labelStyle}>Search Products</label>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button type="submit" style={searchButtonStyle}>
                Search
              </button>
            </form>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={selectStyle}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Min Price ($)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Max Price ($)</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={selectStyle}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="offerPrice">Offer Price</option>
                <option value="ratings">Rating</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                style={selectStyle}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {loadingStates.products ? (
          <Loading />
        ) : displayProducts.length > 0 ? (
          <>
            <div style={productsGridStyle}>
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={pageButtonStyle}
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={currentPage === page ? activePageButtonStyle : pageButtonStyle}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  style={pageButtonStyle}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={noProductsStyle}>
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllProductsPage;