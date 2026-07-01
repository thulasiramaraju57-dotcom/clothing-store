import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import './Category.css';

const Category = () => {
  const { slug } = useParams();
  
  // Filters & Sort state
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest'); // newest, price_asc, price_desc
  const [priceRange, setPriceRange] = useState(10000); // max price
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Available options (normally derived from products or DB)
  const availableSizes = ['0-3M', '3-6M', '6-12M', '1Y', '2Y', '3Y', '4Y', '5Y'];
  const availableColors = ['Cream', 'Navy', 'Hunter Green', 'Burgundy', 'Gold'];

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug, sortOption],
    queryFn: async () => {
      // Map slug back to category enum
      const categoryMap = {
        'boys': 'Boys',
        'girls': 'Girls',
        'newborn': 'Newborn',
        'accessories': 'Accessories'
      };
      const catName = categoryMap[slug] || 'Boys';

      let query = supabase
        .from('products')
        .select(`
          id, name, base_price, category, slug,
          product_images (url)
        `)
        .eq('status', 'published')
        .eq('category', catName);

      // Apply sorting
      if (sortOption === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortOption === 'price_asc') {
        query = query.order('base_price', { ascending: true });
      } else if (sortOption === 'price_desc') {
        query = query.order('base_price', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  // Client-side filtering for complex variants (size/color)
  // In a real production app with millions of rows, this would be done via complex Supabase RPCs or joins
  const filteredProducts = products?.filter(product => {
    // Price filter
    if (product.base_price > priceRange) return false;
    
    // Note: We'd normally filter by size/color by joining the `product_variants` table.
    // For now, we mock the client-side variant filter logic since variants aren't fetched in this simple select.
    return true; 
  }) || [];

  return (
    <div className="category-page">
      {/* Category Header */}
      <header className="category-header bg-cream">
        <div className="container text-center section-padding">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <span>{slug}</span>
          </nav>
          <h1>{slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
        </div>
      </header>

      <div className="container category-layout section-padding">
        
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar mobile-only">
          <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={20} /> Filters
          </button>
          
          <select 
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Sidebar Filters */}
        <aside className={`category-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filter-section">
            <h3>Price: Up to ₹{priceRange}</h3>
            <input 
              type="range" 
              min="0" max="10000" step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="price-slider"
            />
          </div>

          <div className="filter-section">
            <h3>Size <ChevronDown size={16} /></h3>
            <div className="filter-options">
              {availableSizes.map(size => (
                <label key={size} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Color <ChevronDown size={16} /></h3>
            <div className="color-options">
              {availableColors.map(color => (
                <button 
                  key={color} 
                  className={`color-swatch ${selectedColors.includes(color) ? 'selected' : ''}`}
                  title={color}
                  onClick={() => toggleColor(color)}
                  style={{ backgroundColor: getHexForColor(color) }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="category-main">
          {/* Desktop Sort */}
          <div className="desktop-sort-bar desktop-only">
            <span>{filteredProducts.length} Products</span>
            <select 
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Sort by: Price (Low-High)</option>
              <option value="price_desc">Sort by: Price (High-Low)</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state text-center mt-xl">
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later for new arrivals.</p>
              <button className="btn btn-secondary mt-md" onClick={() => {
                setPriceRange(10000);
                setSelectedSizes([]);
                setSelectedColors([]);
              }}>Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Helper for color swatches
function getHexForColor(color) {
  const map = {
    'Cream': '#fdfbf7',
    'Navy': '#1a2a3a',
    'Hunter Green': '#2c4c3b',
    'Burgundy': '#722f37',
    'Gold': '#c5a059'
  };
  return map[color] || '#ccc';
}

export default Category;
