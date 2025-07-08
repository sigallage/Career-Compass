import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          <Link to="/" style={{ ...logoStyle, textDecoration: 'none' }}>
            Career Compass
          </Link>
        </div>
        <nav style={navStyle}>
          <Link 
            to="/" 
            style={{
              ...linkStyle,
              ...(location.pathname === '/' ? activeLinkStyle : {})
            }}
          >
            Job Predictor
          </Link>
          <Link 
            to="/interview-questions" 
            style={{
              ...linkStyle,
              ...(location.pathname === '/interview-questions' ? activeLinkStyle : {})
            }}
          >
            Interview Questions
          </Link>
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  padding: '15px 0',
  borderBottom: '2px solid #FFD700',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backdropFilter: 'blur(10px)'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px'
};

const logoStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#FFD700',
  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
};

const navStyle = {
  display: 'flex',
  gap: '30px'
};

const linkStyle = {
  textDecoration: 'none',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  position: 'relative'
};

const activeLinkStyle = {
  color: '#FFD700',
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  borderBottom: '2px solid #FFD700'
};

export default Header;