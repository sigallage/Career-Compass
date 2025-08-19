import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import logo from '../assets/CP.jpg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        CAREER PILOT
      </div>
      <nav className="nav-links">  
        <Link to="/">HOME</Link>
  <Link to="/dashboard">DASHBOARD</Link>
  <Link to="/recommendations">ANALYZER</Link>
  <Link to="/faq">FAQ</Link>
  <Link to="/videos">VIDEOS</Link>
  <Link to="/signup" className="signup">Login</Link>
      </nav>
    </header>
  );
};

export default Header;