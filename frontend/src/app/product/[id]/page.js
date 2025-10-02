"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '../../../../context/AppContext';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ProductCard from '../../../../components/ProductCard';
import Loading from '../../../../components/Loading';
import { assets } from '../../../../assets/assets';
import '../../../../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { 
    fetchProduct, 
    fetchProducts, 
    addToCart, 
    user, 
    loading,
    currency,
    router,
    apiService 
  } = useAppContext();

  const navigateToHome = async () => {
    try {
      await fetchProducts({ limit: 100 }); 
      router.push('/');
    } catch (error) {
      console.error('Error reloading products:', error);
      router.push('/'); 
    }
  };

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;
      
      try {
        const productData = await fetchProduct(id);
        if (productData) {
          setProduct(productData);
  
          try {
            const relatedResponse = await apiService.getProducts({ category: productData.category, limit: 20 });
            console.log('Related products response for category:', productData.category, relatedResponse);
            const related = relatedResponse.data
              ?.filter(p => p.id !== parseInt(id))
              ?.slice(0, 4) || [];
            console.log('Filtered related products:', related);
            setRelatedProducts(related);
            
            if (related.length === 0) {
              console.log('No related products found in category, fetching random products');
              const randomResponse = await apiService.getProducts({ limit: 10 });
              const randomProducts = randomResponse.data
                ?.filter(p => p.id !== parseInt(id))
                ?.slice(0, 4) || [];
              console.log('Random products:', randomProducts);
              setRelatedProducts(randomProducts);
            }
          } catch (error) {
            console.error('Error loading related products:', error);
            setRelatedProducts([]);
          }
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product details');
      }
    };

    loadProductData();
  }, [id, fetchProduct, fetchProducts]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product?.quantity || 99));
    } else if (action === 'decrease') {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
  
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', `/product/${id}`);
      alert('Please log in to add items to your cart.');
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      addToCart(product, quantity);
      alert(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart successfully!`);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img key={i} src={assets.star_icon} alt="star" className="star-icon" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <img key="half" src={assets.star_dull_icon} alt="half star" className="star-icon" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <img key={`empty-${i}`} src={assets.star_dull_icon} alt="empty star" className="star-icon" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loading />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={navigateToHome} className="back-home-btn">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={navigateToHome} className="back-home-btn">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />
      
      <main className="product-detail-main">
        <div className="breadcrumb">
          <span onClick={navigateToHome} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-link">{product.category}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-detail-container">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.image[selectedImageIndex] || product.image[0]} 
                alt={product.name}
                className="main-product-image"
              />
            </div>
            {product.image.length > 1 && (
              <div className="thumbnail-images">
                {product.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.ratings)}
              </div>
              <span className="rating-text">
                {product.ratings} ({product.reviews} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <span className="offer-price">{currency}{product.offerPrice}</span>
              {product.price !== product.offerPrice && (
                <span className="original-price">{currency}{product.price}</span>
              )}
              {product.price !== product.offerPrice && (
                <span className="discount">
                  {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="stock-status">
              {product.inStock ? (
                <span className="in-stock">✓ In Stock ({product.quantity} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  <img src={assets.decrease_arrow} alt="decrease" />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.quantity}
                  className="quantity-btn"
                >
                  <img src={assets.increase_arrow} alt="increase" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className="add-to-cart-btn"
            >
              {isAddingToCart ? (
                <span className="loading-text">
                  <span className="loading-spinner"></span>
                  Adding to Cart...
                </span>
              ) : (
                <>
                  <img src={assets.cart_icon} alt="cart" />
                  Add to Cart
                </>
              )}
            </button>

            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                <span className="tags-label">Tags:</span>
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="related-products-section">
          <h2>Related Products</h2>
          {relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="no-related-products">
              <p>No related products found in this category.</p>
              <button 
                onClick={() => router.push('/all-products')} 
                className="browse-all-btn"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;