import React from 'react';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  // Format currency in Indian Rupees
  const formatCurrency = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          No transactions yet. Add your first transaction above!
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map(transaction => (
        <div 
          key={transaction._id} 
          className={`transaction-item ${transaction.type}`}
        >
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {transaction.description}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {formatDate(transaction.date)}
            </div>
          </div>
          
          <div>
            <span className={`amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
              {formatCurrency(transaction.amount, transaction.type)}
            </span>
          </div>
          
          <div>
            <span className="category-badge">
              {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
            </span>
          </div>
          
          <div style={{ textTransform: 'capitalize' }}>
            {transaction.type}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-edit"
              onClick={() => onEdit(transaction)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => onDelete(transaction._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;