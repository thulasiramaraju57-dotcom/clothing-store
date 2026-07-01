import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import './Home.css';

const CATEGORIES = [
  { name: 'Boys', slug: 'boys', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Girls', slug: 'girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Newborn', slug: 'newborn', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=800' }
];

const LOOKBOOK_IMAGES = [
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1529158062015-c64defbea2ea?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1519238391515-d9df200c6145?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1611428532454-3e9140df067f?auto=format&fit=crop&q=80&w=400'
];

const Home = () => {
  // Use IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, base_price, slug,
          product_images (url)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .limit(4);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1519238263530-99dad47cb858?auto=format&fit=crop&q=80&w=1600" 
            alt="Children playing" 
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content container">
          <h1 className="animate-fade-up">Timeless Elegance for Little Ones</h1>
          <p className="animate-fade-up delay-100">Heritage-inspired clothing crafted for life's most precious moments.</p>
          <div className="animate-fade-up delay-200">
            <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="categories section-padding container scroll-animate">
        <h2 className="text-center">Shop by Category</h2>
        <div className="grid grid-4 category-grid mt-xl">
          {CATEGORIES.map(category => (
            <Link to={`/category/${category.slug}`} key={category.name} className="category-card">
              <div className="category-img-wrapper">
                <img src={category.image} alt={category.name} />
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured section-padding bg-cream">
        <div className="container scroll-animate">
          <h2 className="text-center">New Arrivals</h2>
          {isLoading ? (
            <div className="loading-state text-center mt-xl">Loading collection...</div>
          ) : featuredProducts?.length > 0 ? (
            <div className="grid grid-4 product-carousel mt-xl">
              {featuredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                  <div className="product-img-wrapper">
                    <img src={product.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1552826978-8fc5fb653995?auto=format&fit=crop&q=80&w=600'} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="price">₹{product.base_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center mt-xl text-muted">No featured items at the moment.</div>
          )}
        </div>
      </section>

      {/* Heritage Story */}
      <section className="heritage section-padding container">
        <div className="grid grid-2 align-center scroll-animate">
          <div className="heritage-image">
            <img src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800" alt="Our Heritage" />
          </div>
          <div className="heritage-content">
            <h2>Our Heritage</h2>
            <p>Founded on the belief that children's clothing should be as beautifully crafted as it is durable, Heirloom Kids Co. brings timeless "old money" aesthetics to the modern playground.</p>
            <p>From our signature tartans to delicate cream linens, every piece is designed to be passed down through generations.</p>
            <Link to="/about" className="btn btn-secondary mt-md">Read Our Story</Link>
          </div>
        </div>
      </section>

      {/* Instagram Lookbook */}
      <section className="lookbook scroll-animate">
        <div className="lookbook-grid">
          {LOOKBOOK_IMAGES.map((img, i) => (
            <div key={i} className="lookbook-item">
              <img src={img} alt="Lookbook" />
              <div className="lookbook-overlay">
                <span>@heirloomkids</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
