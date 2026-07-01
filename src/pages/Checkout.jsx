import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_COST = 150;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('heirloom_cart') || '[]');
    if (items.length === 0) {
      navigate('/cart');
    }
    setCartItems(items);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping; // Ignoring coupons for simplicity in checkout for now

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Upsert Customer
      let customerId;
      const { data: existingCustomer, error: findErr } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (findErr) throw findErr;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: createErr } = await supabase
          .from('customers')
          .insert([{
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }])
          .select()
          .single();
          
        if (createErr) throw createErr;
        customerId = newCustomer.id;
      }

      // 2. Create Order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          customer_id: customerId,
          status: 'pending',
          total_amount: total,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
          shipping_cost: shipping,
          tax_amount: 0, // Simplified
          subtotal: subtotal
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Create Order Items and Update Stock
      for (const item of cartItems) {
        // Find variant to deduct stock
        const { data: variant, error: varFindErr } = await supabase
          .from('product_variants')
          .select('id, stock')
          .eq('product_id', item.product_id)
          .eq('color', item.color)
          .eq('size', item.size)
          .single();

        if (!varFindErr && variant) {
          // Insert order item
          const { error: itemErr } = await supabase
            .from('order_items')
            .insert([{
              order_id: order.id,
              product_id: item.product_id,
              variant_id: variant.id,
              quantity: item.quantity,
              unit_price: item.price,
              total_price: item.price * item.quantity
            }]);
          
          if (itemErr) throw itemErr;

          // Deduct stock
          const newStock = Math.max(0, variant.stock - item.quantity);
          await supabase
            .from('product_variants')
            .update({ stock: newStock })
            .eq('id', variant.id);
        } else {
          // Fallback if variant not found (shouldn't happen in a perfect world)
           await supabase
            .from('order_items')
            .insert([{
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.price,
              total_price: item.price * item.quantity
            }]);
        }
      }

      // 4. Success - Clear cart and redirect
      localStorage.removeItem('heirloom_cart');
      window.dispatchEvent(new Event('cart_updated'));
      navigate('/order-success', { state: { orderId: order.id, email: formData.email } });

    } catch (err) {
      console.error(err);
      setError('An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page bg-cream section-padding">
      <div className="container">
        <div className="checkout-grid">
          
          {/* Left Column: Forms */}
          <div className="checkout-form-section">
            <h2>Shipping Information</h2>
            
            {error && <div className="checkout-error">{error}</div>}

            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group" style={{ width: '50%' }}>
                <label>Postal Code *</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>

              <div className="payment-section">
                <h2>Payment Method</h2>
                <div className="payment-method">
                  <input type="radio" checked readOnly />
                  <span>Cash on Delivery (Test Mode)</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image_url} alt={item.name} className="checkout-item-img" />
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <p className="text-muted">Color: {item.color} | Size: {item.size}</p>
                    <p className="text-muted">Qty: {item.quantity}</p>
                    <p className="checkout-item-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{isFreeShipping ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="btn btn-primary btn-place-order"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <div className="text-center mt-md">
              <Link to="/cart" className="text-muted" style={{ fontSize: '0.875rem' }}>Return to Cart</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
