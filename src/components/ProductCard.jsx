import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false); // In a real app, sync this with a WishlistContext or DB

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigating to the product page when clicking heart
    setInWishlist(!inWishlist);
    
    // Add toast notification logic here later
  };

  // Determine images
  const primaryImage = product.product_images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image';
  const secondaryImage = product.product_images?.[1]?.url || primaryImage;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="product-card-component"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-img-wrapper">
        <img 
          src={primaryImage} 
          alt={product.name} 
          className={`img-primary ${isHovered && secondaryImage !== primaryImage ? 'fade-out' : ''}`}
        />
        {secondaryImage !== primaryImage && (
          <img 
            src={secondaryImage} 
            alt={`${product.name} alternative view`} 
            className={`img-secondary ${isHovered ? 'fade-in' : ''}`}
          />
        )}
        
        <button 
          className="wishlist-btn" 
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={20} 
            fill={inWishlist ? "var(--color-accent-burgundy)" : "none"} 
            color={inWishlist ? "var(--color-accent-burgundy)" : "var(--color-primary)"} 
          />
        </button>
        
        {/* Example Sale Badge Logic */}
        {product.compare_at_price > product.base_price && (
          <span className="sale-badge">SALE</span>
        )}
      </div>
      
      <div className="card-info">
        <h4>{product.name}</h4>
        <div className="price-container">
          {product.compare_at_price > product.base_price && (
            <span className="price-original">₹{product.compare_at_price}</span>
          )}
          <span className="price">₹{product.base_price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
