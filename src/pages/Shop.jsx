import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const [filter, setFilter] = useState('all');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, base_price, category, slug,
          product_images (url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  const filteredProducts = products?.filter(p => {
    if (filter === 'all') return true;
    return p.category.toLowerCase() === filter.toLowerCase();
  }) || [];

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
            <h4>Category</h4>
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
                  className={`filter-btn ${filter === 'Boys' ? 'active' : ''}`}
                  onClick={() => setFilter('Boys')}
                >
                  Boys
                </button>
              </li>
              <li>
                <button 
                  className={`filter-btn ${filter === 'Girls' ? 'active' : ''}`}
                  onClick={() => setFilter('Girls')}
                >
                  Girls
                </button>
              </li>
              <li>
                <button 
                  className={`filter-btn ${filter === 'Newborn' ? 'active' : ''}`}
                  onClick={() => setFilter('Newborn')}
                >
                  Newborn
                </button>
              </li>
              <li>
                <button 
                  className={`filter-btn ${filter === 'Accessories' ? 'active' : ''}`}
                  onClick={() => setFilter('Accessories')}
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <div className="shop-grid">
          {isLoading ? (
            <div className="loading-state">Loading collection...</div>
          ) : error ? (
            <div className="error-state">Failed to load products.</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state text-muted">No products found in this category.</div>
          ) : (
            <div className="grid grid-3">
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card" style={{ textDecoration: 'none' }}>
                  <div className="product-image-container">
                    <img 
                      src={product.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1552826978-8fc5fb653995?auto=format&fit=crop&q=80&w=600'} 
                      alt={product.name} 
                      className="product-image primary" 
                    />
                    <img 
                      src={product.product_images?.[1]?.url || product.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1552826978-8fc5fb653995?auto=format&fit=crop&q=80&w=600'} 
                      alt={`${product.name} lifestyle`} 
                      className="product-image secondary" 
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name" style={{ color: 'var(--color-text-main)' }}>{product.name}</h3>
                    <p className="product-price" style={{ color: 'var(--color-text-main)' }}>₹{product.base_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
