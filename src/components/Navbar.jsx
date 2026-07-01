import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('heirloom_cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart_updated', updateCartCount);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll
    } else {
      setIsScrolled(true); // Always solid on other pages
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart_updated', updateCartCount);
    };
  }, [isHome]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p>Complimentary shipping on orders over ₹2000</p>
      </div>

      <nav className={`navbar ${isHome && !isScrolled ? 'navbar-transparent' : 'navbar-solid'}`}>
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
              Heirloom Kids
            </Link>
          </div>

          <div className="navbar-right">
            <button className="icon-btn"><Search size={20} /></button>
            <Link to="/account" className="icon-btn"><User size={20} /></Link>
            <Link to="/cart" className="icon-btn cart-btn">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
