import React, { useState } from 'react';
import axios from 'axios';

function Database() {
  const [query, setQuery] = useState('SELECT * FROM stocks LIMIT 10');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await axios.post('http://localhost:5000/query', { query });
      setResults(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Backend not reachable. Is app.py running?');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="section-title">Database Explorer</h1>
      <p className="section-subtitle">Run SQL queries directly on the stocks database</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            color: 'var(--accent-green)',
            border: '1px solid var(--border-bright)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.9rem',
            resize: 'vertical',
            marginBottom: '16px'
          }}
        />
        <button className="btn-primary" onClick={runQuery} disabled={loading}>
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)', marginBottom: '24px' }}>
          ⚠ {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="card">
          <p className="section-subtitle">{results.length} rows returned</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  {Object.keys(results[0]).map(col => (
                    <th key={col} style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: 'var(--accent-blue)',
                      borderBottom: '1px solid var(--border-bright)',
                      whiteSpace: 'nowrap'
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                        {val ?? 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Database;