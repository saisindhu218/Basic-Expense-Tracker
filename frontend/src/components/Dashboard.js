import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ 
    total_income: 0, 
    total_expense: 0, 
    balance: 0
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on component mount and refresh
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsResponse, summaryResponse] = await Promise.all([
        transactionsAPI.getAll(),
        transactionsAPI.getSummary()
      ]);
      
      setTransactions(transactionsResponse.data);
      setSummary(summaryResponse.data);
      
    } catch (error) {
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your Dashboard component code remains the same
  const handleCreateTransaction = async (transactionData) => {
    try {
      await transactionsAPI.create(transactionData);
      await fetchData();
      setError('');
    } catch (error) {
      setError('Failed to create transaction');
    }
  };

  const handleUpdateTransaction = async (transactionData) => {
    try {
      await transactionsAPI.update(editingTransaction._id, transactionData);
      setEditingTransaction(null);
      await fetchData();
      setError('');
    } catch (error) {
      setError('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.delete(transactionId);
        await fetchData();
        setError('');
      } catch (error) {
        setError('Failed to delete transaction');
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Expense Tracker Dashboard</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="summary-cards">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <div className="amount positive">{formatCurrency(summary.total_income)}</div>
          </div>
          
          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <div className="amount negative">{formatCurrency(summary.total_expense)}</div>
          </div>
          
          <div className="summary-card balance">
            <h3>Balance</h3>
            <div className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(summary.balance)}
            </div>
          </div>
        </div>
        
        <TransactionForm
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          editingTransaction={editingTransaction}
          onCancel={handleCancelEdit}
        />
        
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Dashboard;