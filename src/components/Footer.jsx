import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>Heirloom Kids</h2>
            <p>Timeless elegance for the modern playground. Crafted with love, designed for generations.</p>
            <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/category/boys">Boys</Link></li>
              <li><Link to="/category/girls">Girls</Link></li>
              <li><Link to="/category/newborn">Newborn</Link></li>
              <li><Link to="/category/accessories">Accessories</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h3>Join Our Newsletter</h3>
            <p>Subscribe for exclusive collections and early access to sales.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
              <input type="email" placeholder="Email Address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Heirloom Kids Co. All rights reserved.</p>
          <div className="payment-icons">
            <CreditCard size={24} />
            {/* Add more icons as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
