import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Heart } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="hero-image-container">
          <img src="/images/hero.png" alt="Children playing in a classic garden" className="hero-image" />
          <div className="hero-overlay">
            <h1 className="hero-title animate-slide-up">Timeless Style for the Next Generation</h1>
            <Link to="/shop" className="btn btn-primary animate-slide-up" style={{ animationDelay: '0.2s' }}>Shop the Heritage Collection</Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="collections section-padding container">
        <h2 className="text-center section-title">Explore Our Collections</h2>
        <div className="grid grid-2">
          
          <Link to="/shop?collection=heritage" className="collection-card">
            <div className="collection-image-wrapper">
              <img src="/images/heritage.png" alt="Heritage Collection" className="collection-image" />
            </div>
            <div className="collection-content">
              <h3>The Heritage Collection</h3>
              <p>Classic, formal old-money styles for special occasions.</p>
              <span className="collection-link">Discover &rarr;</span>
            </div>
          </Link>

          <Link to="/shop?collection=everyday" className="collection-card">
            <div className="collection-image-wrapper">
              <img src="/images/everyday.png" alt="Everyday Collection" className="collection-image" />
            </div>
            <div className="collection-content">
              <h3>The Everyday Collection</h3>
              <p>Premium casual wear and play clothes crafted for durability.</p>
              <span className="collection-link">Discover &rarr;</span>
            </div>
          </Link>
          
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-prop section-padding">
        <div className="container">
          <div className="grid grid-3 text-center">
            
            <div className="value-item">
              <div className="value-icon"><Shield size={40} strokeWidth={1.5} /></div>
              <h4>Premium Fabrics</h4>
              <p>Crafted from the finest linens, worsted wools, and organic cottons.</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon"><Clock size={40} strokeWidth={1.5} /></div>
              <h4>Generational Durability</h4>
              <p>Designed to be loved, worn, and passed down to siblings.</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon"><Heart size={40} strokeWidth={1.5} /></div>
              <h4>Timeless Silhouettes</h4>
              <p>Classic designs that never go out of style.</p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
