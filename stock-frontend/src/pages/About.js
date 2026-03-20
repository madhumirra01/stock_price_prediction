import React from 'react';

function About() {
  return (
    <div className="page">

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <span className="tag tag-blue" style={{ marginBottom: '16px', display: 'inline-block' }}>
          PROJECT OVERVIEW
        </span>
        <h1 className="section-title">
          Stock Market{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Price Analysis
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.8', marginTop: '12px' }}>
          A full-stack web application for exploring, analyzing, and predicting stock market prices.
          Built as a DBMS project to demonstrate real-world integration of a relational database
          with a modern web frontend and a Python backend.
        </p>
      </div>

      <div className="divider" />

      {/* Architecture */}
      <div style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Architecture</h2>
        <p className="section-subtitle">Three-tier client–server model</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', marginTop: '8px' }}>

          {/* Frontend */}
          <div className="card" style={{ flex: '1', minWidth: '160px', textAlign: 'center', borderColor: 'rgba(0,255,136,0.3)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>⬡</div>
            <div style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '6px' }}>
              FRONTEND
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>React</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.6' }}>
              UI, routing, charts, data display
            </p>
          </div>

          {/* Arrow */}
          <div style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>⇄</div>

          {/* Backend */}
          <div className="card" style={{ flex: '1', minWidth: '160px', textAlign: 'center', borderColor: 'rgba(0,136,255,0.3)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>⚙</div>
            <div style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '6px' }}>
              BACKEND
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>Flask</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.6' }}>
              REST API, ML predictions, query handling
            </p>
          </div>

          {/* Arrow */}
          <div style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>⇄</div>

          {/* Database */}
          <div className="card" style={{ flex: '1', minWidth: '160px', textAlign: 'center', borderColor: 'rgba(255,215,0,0.3)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>▣</div>
            <div style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '6px' }}>
              DATABASE
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>MySQL</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.6' }}>
              Stock data storage, SQL queries
            </p>
          </div>

        </div>
      </div>

      <div className="divider" />

      {/* What each page does */}
      <div>
        <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Pages</h2>
        <p className="section-subtitle">What each section of the app does</p>

        <div className="card" style={{ padding: '8px 0' }}>
          {[
            { name: 'Home',       path: '/',           color: 'green', desc: 'Market overview and summary stats' },
            { name: 'Analysis',   path: '/analysis',   color: 'blue',  desc: 'Price charts and technical indicators' },
            { name: 'Prediction', path: '/prediction', color: 'gold',  desc: 'ML-based price forecasting' },
            { name: 'Database',   path: '/database',   color: 'red',   desc: 'Run SQL queries on the stocks table' },
            { name: 'About',      path: '/about',      color: 'blue',  desc: 'Project summary and architecture' },
          ].map((p, i, arr) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '16px 28px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span className={`tag tag-${p.color}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                {p.name}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', minWidth: '100px' }}>
                {p.path}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                {p.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default About;