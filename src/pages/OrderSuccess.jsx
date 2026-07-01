import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="order-success-page bg-cream section-padding">
      <div className="container">
        <div className="success-card">
          <CheckCircle size={64} className="success-icon" />
          <h1>Thank you for your purchase!</h1>
          <p>Your order has been placed successfully and we are getting it ready for shipment.</p>
          
          <div className="order-details-box">
            <h3>Order Number</h3>
            <p className="order-number">#{state.orderId}</p>
            
            <h3 style={{ marginTop: '1rem' }}>Confirmation Sent To</h3>
            <p>{state.email}</p>
          </div>
          
          <Link to="/shop" className="btn btn-primary mt-md">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
