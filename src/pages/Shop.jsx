import React, { useState } from 'react';
import './Shop.css';

const products = [
  {
    id: 1,
    name: 'Classic Cable Knit Sweater',
    price: '$85.00',
    collection: 'heritage',
    image: '/images/product-1.png',
    hoverImage: '/images/product-1-hover.png',
  },
  {
    id: 2,
    name: 'Forest Green Linen Overall',
    price: '$75.00',
    collection: 'everyday',
    image: '/images/product-2.png',
    hoverImage: '/images/product-2-hover.png',
  },
  // Add more products as needed
];

const Shop = () => {
  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.collection === filter);

  return (
    <div className="shop-page container section-padding">
      <div className="shop-header">
        <h1>Curated Collections</h1>
        <p>Explore our timeless pieces designed for your little ones.</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <h3>Filter By</h3>
          <div className="filter-group">
            <h4>Collection</h4>
            <ul>
              <li>
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
              </li>
              <li>
                <button 
                  className={`filter-btn ${filter === 'heritage' ? 'active' : ''}`}
                  onClick={() => setFilter('heritage')}
                >
                  Heritage
                </button>
              </li>
              <li>
                <button 
                  className={`filter-btn ${filter === 'everyday' ? 'active' : ''}`}
                  onClick={() => setFilter('everyday')}
                >
                  Everyday
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <div className="shop-grid grid grid-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image primary" />
                <img src={product.hoverImage || product.image} alt={`${product.name} lifestyle`} className="product-image secondary" />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
