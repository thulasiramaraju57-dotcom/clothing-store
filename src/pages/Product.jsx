import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Heart, ChevronDown, ChevronUp, CheckCircle, ZoomIn } from 'lucide-react';
import './Product.css';
import ProductCard from '../components/ProductCard';

const Product = () => {
  const { id } = useParams();
  
  // Selections
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // UI State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  
  // Accordions
  const [openAccordion, setOpenAccordion] = useState('fabric');

  const { data, isLoading: loading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // Fetch Product with images
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select(`
          *,
          product_images (url, display_order)
        `)
        .eq('id', id)
        .single();
        
      if (prodErr) throw prodErr;

      // Fetch Variants
      const { data: varData, error: varErr } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id);
        
      if (varErr) throw varErr;

      // Fetch Related (Same category, different ID)
      let relData = [];
      if (prodData && prodData.category) {
        const { data: related } = await supabase
          .from('products')
          .select(`id, name, base_price, category, product_images(url)`)
          .eq('category', prodData.category)
          .eq('status', 'published')
          .neq('id', id)
          .limit(4);
        if (related) relData = related;
      }

      return {
        product: prodData,
        variants: varData || [],
        relatedProducts: relData
      };
    }
  });

  // Effect to auto-select color once variants load
  useEffect(() => {
    if (data?.variants && data.variants.length > 0) {
      const firstAvailable = data.variants.find(v => v.stock > 0);
      if (firstAvailable && !selectedColor) {
        setSelectedColor(firstAvailable.color);
      } else if (!selectedColor) {
        setSelectedColor(data.variants[0].color);
      }
    }
  }, [data?.variants, selectedColor]);

  const product = data?.product;
  const variants = data?.variants || [];
  const relatedProducts = data?.relatedProducts || [];

  const images = product?.product_images?.sort((a, b) => a.display_order - b.display_order).map(img => img.url) || [];
  if (images.length === 0) images.push('https://via.placeholder.com/800x1000?text=No+Image');

  // Derive unique colors from variants
  const uniqueColors = [...new Set(variants.map(v => v.color))];
  
  // Get sizes for the selected color
  const sizesForColor = variants.filter(v => v.color === selectedColor);
  
  // Calculate stock for selected size
  const selectedVariant = sizesForColor.find(v => v.size === selectedSize);
  const stockAvailable = selectedVariant ? selectedVariant.stock : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size"); // Native alert just as fallback, UI logic should prevent this
      return;
    }
    
    // Create cart item
    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      image_url: images[0],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      stock: stockAvailable
    };

    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem('heirloom_cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('heirloom_cart', JSON.stringify(existingCart));
    
    // Trigger custom event for Navbar to update badge
    window.dispatchEvent(new Event('cart_updated'));

    // Show Toast
    setToastMessage(`Added ${product.name} to your bag`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
  };

  if (loading) return <div className="container section-padding text-center">Loading elegant details...</div>;
  if (!product) return <div className="container section-padding text-center">Product not found.</div>;

  return (
    <div className="pdp-page">
      {/* Toast Notification */}
      <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
        <CheckCircle size={20} color="var(--color-secondary)" />
        {toastMessage}
      </div>

      <div className="container section-padding">
        <div className="pdp-grid">
          
          {/* Image Gallery */}
          <div className="pdp-gallery">
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
            
            <div className="main-image-wrapper">
              <button className="zoom-toggle" onClick={() => setIsZoomed(!isZoomed)}>
                <ZoomIn size={24} />
              </button>
              <img 
                src={images[activeImageIndex]} 
                alt={product.name} 
                className={`main-image ${isZoomed ? 'zoomed' : ''}`}
                onMouseMove={handleMouseMove}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price-wrapper">
              {product.compare_at_price > product.base_price && (
                <span className="price-original">₹{product.compare_at_price}</span>
              )}
              <span className="product-price">₹{product.base_price}</span>
            </div>
            
            <p className="product-description">{product.description || 'A timeless addition to your little one\'s wardrobe.'}</p>

            {/* Colors */}
            {uniqueColors.length > 0 && (
              <div className="selector-section">
                <div className="selector-header">
                  <span>Color: <strong>{selectedColor}</strong></span>
                </div>
                <div className="color-swatches">
                  {uniqueColors.map(color => (
                    <button 
                      key={color} 
                      className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: getHexForColor(color) }}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(''); // Reset size on color change
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizesForColor.length > 0 && (
              <div className="selector-section">
                <div className="selector-header">
                  <span>Size</span>
                  <button className="btn-link" onClick={() => setOpenAccordion('size')}>Size Guide</button>
                </div>
                <div className="size-pills">
                  {sizesForColor.map(variant => {
                    const isOutOfStock = variant.stock === 0;
                    return (
                      <button 
                        key={variant.size} 
                        className={`size-pill ${selectedSize === variant.size ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                        onClick={() => !isOutOfStock && setSelectedSize(variant.size)}
                        disabled={isOutOfStock}
                      >
                        {variant.size}
                      </button>
                    )
                  })}
                </div>
                
                {selectedSize && (
                  <div className="stock-indicator">
                    {stockAvailable > 0 && stockAvailable <= 5 ? (
                      <span className="text-burgundy">Only {stockAvailable} left!</span>
                    ) : stockAvailable === 0 ? (
                      <span className="text-burgundy">Out of stock</span>
                    ) : (
                      <span className="text-secondary">In stock</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="actions-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={stockAvailable && quantity >= stockAvailable}>+</button>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={!selectedSize || stockAvailable === 0}
              >
                {stockAvailable === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              
              <button 
                className="wishlist-action-btn"
                onClick={() => setInWishlist(!inWishlist)}
              >
                <Heart size={24} fill={inWishlist ? "var(--color-accent-burgundy)" : "none"} />
              </button>
            </div>

            {/* Accordions */}
            <div className="accordions">
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('fabric')}>
                  Fabric & Care {openAccordion === 'fabric' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`accordion-content ${openAccordion === 'fabric' ? 'open' : ''}`}>
                  <p>100% Organic Cotton. Machine wash cold with like colors. Tumble dry low. Do not bleach. Warm iron if needed.</p>
                </div>
              </div>
              
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('size')}>
                  Size Guide {openAccordion === 'size' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`accordion-content ${openAccordion === 'size' ? 'open' : ''}`}>
                  <table className="size-chart">
                    <thead>
                      <tr>
                        <th>Size</th><th>Height (cm)</th><th>Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>0-3M</td><td>55-61</td><td>4-6</td></tr>
                      <tr><td>3-6M</td><td>61-67</td><td>6-8</td></tr>
                      <tr><td>6-12M</td><td>67-78</td><td>8-10</td></tr>
                      <tr><td>1Y</td><td>78-83</td><td>10-12</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                  Shipping & Returns {openAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`accordion-content ${openAccordion === 'shipping' ? 'open' : ''}`}>
                  <p>Complimentary shipping on orders over ₹2000. Returns accepted within 30 days of purchase in unworn condition with tags attached.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products mt-3xl">
            <h2 className="text-center mb-xl">You May Also Like</h2>
            <div className="grid grid-4">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
function getHexForColor(color) {
  const map = {
    'Cream': '#fdfbf7',
    'Navy': '#1a2a3a',
    'Hunter Green': '#2c4c3b',
    'Burgundy': '#722f37',
    'Gold': '#c5a059'
  };
  return map[color] || '#ccc';
}

export default Product;
