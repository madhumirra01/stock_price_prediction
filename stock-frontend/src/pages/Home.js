import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const TICKERS = [
  { sym: 'AAPL', price: '189.43', change: '+1.23%', up: true },
  { sym: 'TSLA', price: '238.77', change: '-0.87%', up: false },
  { sym: 'GOOGL', price: '142.56', change: '+2.14%', up: true },
  { sym: 'AMZN', price: '178.92', change: '+0.56%', up: true },
  { sym: 'MSFT', price: '415.30', change: '-0.32%', up: false },
  { sym: 'NVDA', price: '875.40', change: '+3.87%', up: true },
  { sym: 'META', price: '512.88', change: '+1.10%', up: true },
  { sym: 'NFLX', price: '623.50', change: '-1.45%', up: false },
];

const FEATURES = [
  {
    icon: '◈',
    title: 'Stock Analysis',
    desc: 'Explore historical stock price trends and visualize market behaviour.',
    link: '/analysis',
    color: 'green',
  },
  {
    icon: '◎',
    title: 'Price Prediction',
    desc: 'Use machine learning models to analyze and forecast stock price trends.',
    link: '/prediction',
    color: 'blue',
  },
  {
    icon: '▣',
    title: 'Database Explorer',
    desc: 'Browse the stock dataset and view records stored in the database.',
    link: '/database',
    color: 'gold',
  },
];

function MiniChart({ up }) {
  const points = up
    ? '0,50 20,45 40,48 60,35 80,30 100,20 120,15 140,10'
    : '0,10 20,15 40,12 60,25 80,30 100,42 120,45 140,50';

  const fill = up
    ? 'M0,50 20,45 40,48 60,35 80,30 100,20 120,15 140,10 L140,60 L0,60Z'
    : 'M0,10 20,15 40,12 60,25 80,30 100,42 120,45 140,50 L140,60 L0,60Z';

  return (
    <svg width="140" height="60" viewBox="0 0 140 60">
      <defs>
        <linearGradient id={`grad-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#00ff88' : '#ff3355'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={up ? '#00ff88' : '#ff3355'} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={fill} fill={`url(#grad-${up})`} />

      <polyline
        points={points}
        fill="none"
        stroke={up ? '#00ff88' : '#ff3355'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Home() {
  const tickerRef = useRef(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let pos = 0;
    const speed = 0.5;
    const total = ticker.scrollWidth / 2;

    const animate = () => {
      pos += speed;

      if (pos >= total) pos = 0;

      ticker.style.transform = `translateX(-${pos}px)`;

      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="home-page">

      {/* Ticker Strip */}
      <div className="ticker-strip">
        <div className="ticker-track" ref={tickerRef}>
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className={`ticker-item ${t.up ? 'up' : 'down'}`}>
              <strong>{t.sym}</strong>
              <span>{t.price}</span>
              <span className="change">{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-label fade-up">
          STOCK MARKET ANALYSIS SYSTEM
        </div>

        <h1 className="hero-title fade-up delay-1">
          Intelligent
          <br />
          <span className="gradient-text">Market Analytics</span>
          <br />
          Platform
        </h1>

        <p className="hero-sub fade-up delay-2">
          Explore historical stock market data, analyze price trends,
          and experiment with machine learning based price predictions.
        </p>

        <div className="hero-actions fade-up delay-3">
          <Link to="/analysis" className="btn-primary">
            Start Analysis →
          </Link>

          <Link to="/prediction" className="btn-secondary">
            View Predictions
          </Link>
        </div>
      </section>

      {/* Market Preview */}
      <section className="live-section">
        <div className="section-header">
          <h2 className="section-title">Market Data Preview</h2>
        </div>

        <div className="stocks-grid">
          {TICKERS.map((t, i) => (
            <div key={i} className={`stock-card ${t.up ? 'up' : 'down'}`}>

              <div className="stock-top">
                <div>
                  <div className="stock-sym">{t.sym}</div>
                  <div className="stock-full">Dataset Sample</div>
                </div>

                <span className={`change-badge ${t.up ? 'up' : 'down'}`}>
                  {t.change}
                </span>
              </div>

              <MiniChart up={t.up} />

              <div className="stock-price">
                ${t.price}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">

        <h2 className="section-title fade-up">
          Core Features
        </h2>

        <div className="features-grid">

          {FEATURES.map((f, i) => (
            <Link
              key={i}
              to={f.link}
              className={`feature-card color-${f.color}`}
            >

              <div className="feature-icon">
                {f.icon}
              </div>

              <h3 className="feature-title">
                {f.title}
              </h3>

              <p className="feature-desc">
                {f.desc}
              </p>

              <span className="feature-link">
                Explore →
              </span>

            </Link>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;