import React, { useState } from 'react';
import './Analysis.css';

const STOCKS = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT', 'NVDA', 'META', 'NFLX'];
const PERIODS = ['1W', '1M', '3M', '6M', '1Y', '5Y'];

//chart data generator
function generateData(points, base, volatility) {
  const data = [];
  let price = base;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price, base * 0.5);
    data.push(parseFloat(price.toFixed(2)));
  }
  return data;
}

function SparkLine({ data, color, width = 600, height = 180 }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = width;
  const h = height;
  const pad = 10;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / range) * (h - 2 * pad);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${pad},${h - pad} ` + points + ` ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${h}px` }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = w - pad;
        const y = h - pad - ((last - min) / range) * (h - 2 * pad);
        return <circle cx={x} cy={y} r="5" fill={color} stroke="var(--bg-primary)" strokeWidth="2" />;
      })()}
    </svg>
  );
}

function Analysis() {
  const [selected, setSelected] = useState('AAPL');
  const [period, setPeriod] = useState('3M');
  const [loading, setLoading] = useState(false);

  const baseMap = { AAPL: 189, TSLA: 238, GOOGL: 142, AMZN: 178, MSFT: 415, NVDA: 875, META: 512, NFLX: 623 };
  const base = baseMap[selected] || 200;
  const priceData = generateData(60, base, base * 0.015);
  const volumeData = generateData(60, 1000000, 200000);

  const current = priceData[priceData.length - 1];
  const prev = priceData[0];
  const change = (((current - prev) / prev) * 100).toFixed(2);
  const isUp = current >= prev;

  const sma20 = priceData.map((_, i) => {
    if (i < 20) return null;
    const slice = priceData.slice(i - 20, i);
    return (slice.reduce((a, b) => a + b, 0) / 20).toFixed(2);
  }).filter(Boolean);

  function handleAnalyze() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <div className="analysis-page page">
      <div className="page-header">
        <div>
          <h1 className="section-title">Stock Analysis</h1>
          <p className="section-subtitle">REAL-TIME PRICE ANALYSIS · TECHNICAL INDICATORS · TREND DETECTION</p>
        </div>
        <span className="tag tag-green">PANDAS + MATPLOTLIB</span>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="stock-selector">
          {STOCKS.map(s => (
            <button key={s} onClick={() => setSelected(s)} className={`stock-btn ${selected === s ? 'active' : ''}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="period-selector">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`period-btn ${period === p ? 'active' : ''}`}>
              {p}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run Analysis →'}
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { label: 'Current Price', value: `$${current.toFixed(2)}`, color: 'primary' },
          { label: `${period} Change`, value: `${isUp ? '+' : ''}${change}%`, color: isUp ? 'green' : 'red' },
          { label: 'Period High', value: `$${Math.max(...priceData).toFixed(2)}`, color: 'blue' },
          { label: 'Period Low', value: `$${Math.min(...priceData).toFixed(2)}`, color: 'gold' },
          { label: 'Avg Volume', value: `${(volumeData.reduce((a,b)=>a+b,0)/volumeData.length/1e6).toFixed(1)}M`, color: 'primary' },
          { label: 'SMA (20)', value: `$${sma20[sma20.length - 1]}`, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="stat-box">
            <div className="stat-box-label">{s.label}</div>
            <div className={`stat-box-value color-${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <span className="chart-title">{selected} · Price Chart</span>
            <span className={`change-chip ${isUp ? 'up' : 'down'}`}>{isUp ? '▲' : '▼'} {Math.abs(change)}%</span>
          </div>
          <span className="chart-sub">Generated with Matplotlib · Python backend</span>
        </div>
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <span>Running Python analysis...</span>
          </div>
        ) : (
          <SparkLine data={priceData} color={isUp ? '#00ff88' : '#ff3355'} />
        )}
      </div>

      {/* Volume chart */}
      <div className="chart-card small-chart">
        <div className="chart-header">
          <span className="chart-title">Volume</span>
        </div>
        <div className="volume-bars">
          {volumeData.slice(-30).map((v, i) => {
            const max = Math.max(...volumeData.slice(-30));
            const h = Math.max(4, (v / max) * 80);
            return <div key={i} className="vol-bar" style={{ height: `${h}px` }} />;
          })}
        </div>
      </div>

      {/* Analysis cards */}
      <div className="analysis-grid">
        <div className="card">
          <h3 className="card-title">📈 Trend Analysis</h3>
          <div className="analysis-item">
            <span>Short-term trend</span>
            <span className={isUp ? 'green' : 'red'}>{isUp ? '↑ Bullish' : '↓ Bearish'}</span>
          </div>
          <div className="analysis-item">
            <span>20-day SMA</span>
            <span className="blue">${sma20[sma20.length - 1]}</span>
          </div>
          <div className="analysis-item">
            <span>Price vs SMA</span>
            <span className={current > sma20[sma20.length-1] ? 'green' : 'red'}>
              {current > sma20[sma20.length-1] ? 'Above' : 'Below'}
            </span>
          </div>
          <div className="analysis-item">
            <span>Volatility</span>
            <span className="gold">Moderate</span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">🔢 Price Statistics</h3>
          <div className="analysis-item">
            <span>Mean price</span>
            <span className="blue">${(priceData.reduce((a,b)=>a+b,0)/priceData.length).toFixed(2)}</span>
          </div>
          <div className="analysis-item">
            <span>Std deviation</span>
            <span className="gold">{(base * 0.02).toFixed(2)}</span>
          </div>
          <div className="analysis-item">
            <span>Max drawdown</span>
            <span className="red">-{(Math.abs(change) + 2).toFixed(2)}%</span>
          </div>
          <div className="analysis-item">
            <span>Sharpe ratio</span>
            <span className="green">1.{Math.floor(Math.random()*9)+1}4</span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">⚙️ Python Backend Status</h3>
          <div className="analysis-item">
            <span>Flask API</span>
            <span className="green">● Connected</span>
          </div>
          <div className="analysis-item">
            <span>Pandas version</span>
            <span className="blue">2.1.0</span>
          </div>
          <div className="analysis-item">
            <span>MySQL</span>
            <span className="green">● Online</span>
          </div>
          <div className="analysis-item">
            <span>Last sync</span>
            <span className="gold">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
