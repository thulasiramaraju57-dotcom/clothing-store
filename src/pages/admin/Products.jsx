import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const initialProducts = [
  { id: 1, name: 'Classic Cable Knit Sweater', price: 85.00, collection: 'heritage', stock: 12 },
  { id: 2, name: 'Forest Green Linen Overall', price: 75.00, collection: 'everyday', stock: 8 },
  { id: 3, name: 'Burgundy Corduroy Dress', price: 95.00, collection: 'heritage', stock: 5 },
  { id: 4, name: 'Crisp Cream Button-Down', price: 65.00, collection: 'everyday', stock: 20 },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', collection: 'everyday', stock: '' });

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      collection: newProduct.collection,
      stock: parseInt(newProduct.stock, 10)
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', collection: 'everyday', stock: '' });
    setShowAddForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between">
        <h2>Inventory Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> 
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="admin-card animate-slide-up">
          <h3>Add New Product</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Collection</label>
              <select value={newProduct.collection} onChange={e => setNewProduct({...newProduct, collection: e.target.value})}>
                <option value="everyday">Everyday</option>
                <option value="heritage">Heritage</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save Product</button>
            <button type="button" className="btn btn-secondary" style={{marginLeft: '1rem'}} onClick={() => setShowAddForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Collection</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td style={{textTransform: 'capitalize'}}>{product.collection}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="action-btn"><Edit2 size={16} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
