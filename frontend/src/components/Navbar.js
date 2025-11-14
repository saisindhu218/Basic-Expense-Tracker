import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken, removeUser, isAuthenticated } from '../utils/auth';

const Navbar = ({ authenticated, setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    removeUser();
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          💰 ExpenseTracker
        </Link>
        <div className="navbar-nav">
          {authenticated ? (
            <>
              <Link to="/">Dashboard</Link>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontSize: '1rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;