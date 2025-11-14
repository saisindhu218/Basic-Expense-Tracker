import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, editingTransaction, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: editingTransaction.date
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    if (!editingTransaction) {
      setFormData({
        amount: '',
        description: '',
        category: 'food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const categories = [
    'food', 'rent', 'bills', 'entertainment', 'shopping', 
    'transport', 'healthcare', 'education', 'salary', 'other'
  ];

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" className="btn btn-primary">
          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
        {editingTransaction && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;