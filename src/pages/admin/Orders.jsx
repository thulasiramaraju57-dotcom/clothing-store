import React, { useState } from 'react';
import { Eye } from 'lucide-react';

const initialOrders = [
  { id: 1042, customer: 'Eleanor Vance', date: 'Today, 10:42 AM', total: 145.00, status: 'Fulfilled', items: 2 },
  { id: 1043, customer: 'Arthur Pendelton', date: 'Today, 1:15 PM', total: 85.00, status: 'Processing', items: 1 },
  { id: 1044, customer: 'Beatrice Ward', date: 'Yesterday, 9:30 AM', total: 210.00, status: 'Fulfilled', items: 3 },
  { id: 1045, customer: 'Charles Bingley', date: 'Yesterday, 2:45 PM', total: 65.00, status: 'Processing', items: 1 },
  { id: 1046, customer: 'Jane Fairfax', date: 'Jun 28, 11:20 AM', total: 170.00, status: 'Fulfilled', items: 2 },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fulfilled':
        return <span className="badge badge-success">Fulfilled</span>;
      case 'Processing':
        return <span className="badge badge-pending">Processing</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between">
        <h2>Order Management</h2>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <button className="action-btn"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
