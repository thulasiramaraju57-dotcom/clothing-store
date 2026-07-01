import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('heirloom_cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('cart_updated', updateCartCount);
    return () => window.removeEventListener('cart_updated', updateCartCount);
  }, []);
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-left">
          <button className="icon-btn mobile-only"><Menu size={24} /></button>
          <div className="navbar-links desktop-only">
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/about" className="nav-link">Our Story</Link>
          </div>
        </div>

        <div className="navbar-center">
          <Link to="/" className="navbar-logo">
            Heirloom Kids Co.
          </Link>
        </div>

        <div className="navbar-right">
          <button className="icon-btn"><Search size={20} /></button>
          <Link to="/cart" className="icon-btn" style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--color-accent-burgundy)',
                color: 'white',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '700',
                lineHeight: '1'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
