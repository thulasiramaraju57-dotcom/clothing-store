import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
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
          <button className="icon-btn"><ShoppingBag size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
