import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { path: '/',           label: 'Home',       icon: '⬡' },
    { path: '/analysis',   label: 'Analysis',   icon: '◈' },
    { path: '/prediction', label: 'Prediction', icon: '◎' },
    { path: '/database',   label: 'Database',   icon: '▣' },
    { path: '/about',      label: 'About',      icon: '◉' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▲</span>
          <span className="logo-text">Stock<span className="logo-accent">AI</span></span>
          <span className="logo-tag">ANALYSIS</span>
        </Link>

        {/* Links */}
        <div className="navbar-links">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Live clock */}
        <div className="navbar-clock">
          <span className="clock-dot"></span>
          <span className="clock-time">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          <span className="clock-label">LIVE</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
