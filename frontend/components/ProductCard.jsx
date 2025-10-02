import React, { useState } from 'react'
import Image from 'next/image';
import { useAppContext } from '../context/AppContext';
import '../styles/ProductCard.css';
import { assets } from '../assets/assets';

const ProductCard = ({ product }) => {

    const { currency, router, addToCart, user } = useAppContext()
    const [isAdding, setIsAdding] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        
        if (!user) {
            sessionStorage.setItem('redirectAfterLogin', `/product/${product.id}`);
            alert('Please log in to add items to your cart.');
            router.push('/login');
            return;
        }
        
        setIsAdding(true);
        
        try {
            addToCart(product, 1);
            console.log(`Added ${product.name} to cart`);
            
            setShowNotification(true);
            
            setTimeout(() => {
                setShowNotification(false);
                setIsAdding(false);
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setIsAdding(false);
        }
    };

    return (
        <div
            onClick={() => { router.push('/product/' + product.id); scrollTo(0, 0) }}
            className="product-card"
            style={{ position: 'relative' }}
        >
            {showNotification && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        animation: 'fadeInOut 2s ease-in-out'
                    }}
                >
                    ✓ Added to cart!
                </div>
            )}
            <div className="product-card-image-container">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="product-card-image"
                    width={800}
                    height={800}
                />
                <button className="product-card-heart-btn">
                    <Image
                        className="product-card-heart-icon"
                        src={assets.heart_icon}
                        alt="heart_icon"
                        width={20}
                        height={20}
                    />
                </button>
            </div>

            <p className="product-card-name">{product.name}</p>
            <p className="product-card-description">{product.description}</p>
            <div className="product-card-rating">
                <p className="product-card-rating-number">{product.ratings || 0}</p>
                <div className="product-card-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="product-card-star-icon"
                            src={
                                index < Math.floor(product.ratings || 0)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                            width={16}
                            height={16}
                        />
                    ))}
                </div>
            </div>

            <div className="product-card-footer">
                <p className="product-card-price">{currency}{product.offerPrice}</p>
                <button 
                    className="product-card-buy-btn"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    style={{ 
                        opacity: isAdding ? 0.7 : 1,
                        cursor: isAdding ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isAdding ? 'Adding...' : 'Add to cart'}
                </button>
            </div>
        </div>
    )
}

export default ProductCard