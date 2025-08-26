import React from 'react'
import Image from 'next/image';
import { useAppContext } from '../context/AppContext';
import '../styles/ProductCard.css';
import { assets } from '../assets/assets';

const ProductCard = ({ product }) => {

    const { currency, router } = useAppContext()

    return (
        <div
            onClick={() => { router.push('/product/' + product.id); scrollTo(0, 0) }}
            className="product-card"
        >
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
                <button className="product-card-buy-btn">
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard