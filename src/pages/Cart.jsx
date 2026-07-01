import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, ShoppingBag } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_COST = 150;

  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart_updated', handleCartUpdate);
    return () => window.removeEventListener('cart_updated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('heirloom_cart') || '[]');
    setCartItems(items);
  };

  const saveCart = (items) => {
    localStorage.setItem('heirloom_cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = cartItems.map(item => {
      if (item.id === id) {
        // Prevent exceeding stock
        return { ...item, quantity: Math.min(newQuantity, item.stock) };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode) return;

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();
        
      if (error || !data) {
        setCouponError('Invalid or expired coupon code.');
        setDiscountAmount(0);
        return;
      }
      
      // Calculate discount
      if (data.discount_type === 'percentage') {
        const discount = Math.round(subtotal * (data.discount_value / 100));
        setDiscountAmount(discount);
      } else {
        setDiscountAmount(data.discount_value);
      }
      
      setCouponSuccess(`Coupon applied!`);
    } catch (err) {
      console.error(err);
      setCouponError('Error applying coupon. Please try again.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal - discountAmount) + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding text-center empty-cart">
        <ShoppingBag size={64} className="mb-md" color="var(--color-text-light)" />
        <h2>Your bag is empty</h2>
        <p className="mb-lg">Looks like you haven't made your choice yet.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page bg-cream">
      <div className="container section-padding">
        <h1>Your Bag</h1>
        
        <div className="cart-grid">
          {/* Main Cart Items */}
          <div className="cart-items-section">
            
            {/* Free Shipping Bar */}
            <div className="free-shipping-bar-container">
              {isFreeShipping ? (
                <p><strong>Congratulations!</strong> You get free shipping.</p>
              ) : (
                <p>Add <strong>₹{amountToFreeShipping}</strong> more to your order to get free shipping.</p>
              )}
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <Link to={`/product/${item.product_id}`}>
                      <img src={item.image_url} alt={item.name} />
                    </Link>
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <Link to={`/product/${item.product_id}`} className="cart-item-title">{item.name}</Link>
                      <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="cart-item-variant">Color: {item.color} | Size: {item.size}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >+</button>
                      </div>
                      <div className="cart-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                    {item.quantity >= item.stock && (
                      <p className="stock-warning">Max stock reached</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-section">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{isFreeShipping ? 'Free' : `₹${shipping}`}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* Coupon Form */}
              <form className="coupon-form mt-md" onSubmit={applyCoupon}>
                <div className="coupon-input-group">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary">Apply</button>
                </div>
                {couponError && <p className="coupon-msg error">{couponError}</p>}
                {couponSuccess && <p className="coupon-msg success">{couponSuccess}</p>}
              </form>

              <button 
                className="btn btn-primary w-100 mt-lg checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
