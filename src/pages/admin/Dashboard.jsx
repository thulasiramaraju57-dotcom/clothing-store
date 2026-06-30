import React from 'react';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex-between">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="metric-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-title">Total Revenue (30d)</div>
          <div className="metric-value">$14,250</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Active Orders</div>
          <div className="metric-value">24</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Total Customers</div>
          <div className="metric-value">842</div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1042</td>
              <td>Eleanor Vance</td>
              <td>Today, 10:42 AM</td>
              <td>$145.00</td>
              <td><span className="badge badge-success">Fulfilled</span></td>
            </tr>
            <tr>
              <td>#1043</td>
              <td>Arthur Pendelton</td>
              <td>Today, 1:15 PM</td>
              <td>$85.00</td>
              <td><span className="badge badge-pending">Processing</span></td>
            </tr>
            <tr>
              <td>#1044</td>
              <td>Beatrice Ward</td>
              <td>Yesterday</td>
              <td>$210.00</td>
              <td><span className="badge badge-success">Fulfilled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
