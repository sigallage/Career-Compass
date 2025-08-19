import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Header.css';

import logo from '../assets/CP.jpg';

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };
  
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        CAREER PILOT
      </div>
      <nav className="nav-links">  
        <Link 
          to="/" 
          className={isActiveLink('/') ? 'active' : ''}
        >
          HOME
        </Link>
        <Link 
          to="/interview-questions"
          className={isActiveLink('/interview-questions') ? 'active' : ''}
        >
          INTERVIEW QUESTIONS
        </Link>
        <Link 
          to="/job-predictor"
          className={isActiveLink('/job-predictor') ? 'active' : ''}
        >
          JOB PREDICTOR
        </Link>
        <Link 
          to="/contact"
          className={isActiveLink('/contact') ? 'active' : ''}
        >
          CONTACT
        </Link>
        <Link 
          to="/faq"
          className={isActiveLink('/faq') ? 'active' : ''}
        >
          FAQ
        </Link>
        {!isAuthenticated ? (
          <button
            type="button"
            className="login"
            onClick={() => loginWithRedirect()}
          >
            Login
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '40px' }}>
            <span style={{ color: '#FFD700', fontSize: '0.9rem' }}>
              Welcome, {user?.name || 'User'}
            </span>
            <button
              type="button"
              className="login"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;