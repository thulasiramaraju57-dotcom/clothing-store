import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Home } from 'lucide-react';
import '../pages/admin/Admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Heirloom Admin</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin" className={`admin-nav-link ${currentPath === '/admin' ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className={`admin-nav-link ${currentPath === '/admin/products' ? 'active' : ''}`}>
                <Package size={20} />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className={`admin-nav-link ${currentPath === '/admin/orders' ? 'active' : ''}`}>
                <ShoppingCart size={20} />
                <span>Orders</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="admin-nav-bottom">
          <Link to="/" className="admin-nav-link">
            <Home size={20} />
            <span>Storefront</span>
          </Link>
          <button className="admin-nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>Backend Portal</h1>
          </div>
          <div className="admin-user-profile">
            <div className="avatar">A</div>
            <span>Admin User</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
