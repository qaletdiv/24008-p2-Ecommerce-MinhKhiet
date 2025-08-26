"use client"
import React, { useState } from "react";

import Link from "next/link"
import { useAppContext } from "../context/AppContext";
import Image from "next/image";
import "../styles/Navbar.css";
import { assets } from "../assets/assets";

const Navbar = () => {

  const { 
    isSeller, 
    user, 
    router, 
    getCartCount, 
    logoutUser,
    fetchProducts
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      setIsSearching(true);
      try {
        const response = await fetchProducts({ search: query, limit: 5 });
        setSearchResults(response.data || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleUserMenuClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logoutUser();
      setShowUserMenu(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-search-container')) {
        setShowSearchResults(false);
      }
      if (!event.target.closest('.navbar-user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar-container">
      <Image
        className="navbar-logo"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
        width={128}
        height={40}
      />
      <div className="navbar-links">
        <Link href="/" className="navbar-link">
          Home
        </Link>
        <Link href="/all-products" className="navbar-link">
          Shop
        </Link>
        <Link href="/" className="navbar-link">
          About Us
        </Link>
        <Link href="/" className="navbar-link">
          Contact
        </Link>

        {isSeller && (
          <button onClick={() => router.push('/seller')} className="navbar-seller-btn">
            Seller Dashboard
          </button>
        )}
      </div>

      <div className="navbar-actions">
        <div className="navbar-search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search products..."
              className="search-input"
              suppressHydrationWarning={true}
            />
            <button type="submit" className="search-btn" suppressHydrationWarning={true}>
              <Image src={assets.search_icon} alt="search icon" className="search-icon" width={18} height={18} />
            </button>
          </form>
          
          {showSearchResults && (
            <div className="search-results">
              {isSearching ? (
                <div className="search-loading">Searching...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map(product => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.image[0]} alt={product.name} className="result-image" />
                      <div className="result-details">
                        <span className="result-name">{product.name}</span>
                        <span className="result-price">${product.offerPrice}</span>
                      </div>
                    </div>
                  ))}
                  <div className="search-see-all" onClick={() => handleSearchSubmit({ preventDefault: () => {} })}>
                    See all results for "{searchQuery}"
                  </div>
                </>
              ) : (
                <div className="search-no-results">No products found</div>
              )}
            </div>
          )}
        </div>

        <button 
          className="navbar-cart-btn"
          onClick={() => router.push('/cart')}
          suppressHydrationWarning={true}
        >
          <div className="cart-icon-container">
            <Image src={assets.cart_icon} alt="cart icon" className="cart-icon" width={24} height={24} />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </div>
          <span className="cart-text">Cart</span>
        </button>

        <div className="navbar-user-menu-container">
          <button className="navbar-account-btn" onClick={handleUserMenuClick} suppressHydrationWarning={true}>
            <Image src={assets.user_icon} alt="user icon" width={24} height={24} />
            <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
          </button>
          
          {showUserMenu && user && (
            <div className="user-menu">
              <div className="user-menu-header">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <div className="user-menu-items">
                <button onClick={() => { router.push('/account'); setShowUserMenu(false); }}>
                  <Image src={assets.user_icon} alt="profile" className="menu-icon" width={16} height={16} />
                  My Account
                </button>
                <button onClick={() => { router.push('/cart'); setShowUserMenu(false); }}>
                  <Image src={assets.cart_icon} alt="cart" className="menu-icon" width={16} height={16} />
                  My Cart ({getCartCount()})
                </button>
                <button onClick={() => { router.push('/orders'); setShowUserMenu(false); }}>
                  <Image src={assets.order_icon} alt="orders" className="menu-icon" width={16} height={16} />
                  My Orders
                </button>
                <div className="menu-divider"></div>
                <button onClick={handleLogout} className="logout-btn">
                  <Image src={assets.arrow_icon} alt="logout" className="menu-icon logout-icon" width={16} height={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-mobile-actions">
        <button 
          className="mobile-search-toggle"
          onClick={() => setShowSearchResults(!showSearchResults)}
          suppressHydrationWarning={true}
        >
          <Image src={assets.search_icon} alt="search" width={20} height={20} />
        </button>
        
        <button 
          className="mobile-cart-btn"
          onClick={() => router.push('/cart')}
          suppressHydrationWarning={true}
        >
          <div className="cart-icon-container">
            <Image src={assets.cart_icon} alt="cart" width={20} height={20} />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </div>
        </button>

        {isSeller && (
          <button onClick={() => router.push('/seller')} className="navbar-seller-btn mobile" suppressHydrationWarning={true}>
            Seller
          </button>
        )}
        
        <button className="navbar-account-btn" onClick={handleUserMenuClick} suppressHydrationWarning={true}>
          <Image src={assets.user_icon} alt="user icon" width={24} height={24} />
          <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
        </button>
      </div>
      
      {showSearchResults && (
        <div className="mobile-search-container">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search products..."
              className="mobile-search-input"
              autoFocus
              suppressHydrationWarning={true}
            />
            <button type="submit" className="mobile-search-btn" suppressHydrationWarning={true}>
              <Image src={assets.search_icon} alt="search" width={18} height={18} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;