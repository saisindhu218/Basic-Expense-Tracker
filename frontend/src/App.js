import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { isAuthenticated } from './utils/auth';
import './App.css';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when app loads
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
        <Routes>
          <Route 
            path="/login" 
            element={!authenticated ? <Login setAuthenticated={setAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!authenticated ? <Register setAuthenticated={setAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;