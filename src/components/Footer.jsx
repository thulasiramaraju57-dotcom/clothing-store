import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h2 className="footer-logo">Heirloom Kids Co.</h2>
            <p className="footer-tagline">Crafted for childhood. Styled for generations.</p>
            <div className="social-icons">
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Explore</h3>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/shop?collection=heritage">Heritage Collection</Link></li>
              <li><Link to="/shop?collection=everyday">Everyday Collection</Link></li>
              <li><Link to="/about">Our Story</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Customer Care</h3>
            <ul>
              <li><a href="#">Sizing Chart</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3 className="footer-title">Join Our Inner Circle</h3>
            <p>Sign up for early access to new collections and exclusive offers.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Heirloom Kids Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
