import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TICKERS = ["AAPL", "AMZN", "CAT", "GS", "JNJ", "JPM", "KO", "MSFT", "PG", "XOM"];

export default function PredictionPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (selectedTicker) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.get(`http://localhost:5000/predict?ticker=${selectedTicker}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch prediction.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchPrediction(ticker); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPrediction(ticker);
  };

  // Build chart data — sample every 5 points to avoid clutter
  const chartData = data
    ? data.dates
        .filter((_, i) => i % 5 === 0)
        .map((date, i) => ({
          date,
          Actual: data.actual[i * 5],
          Predicted: data.predicted[i * 5],
        }))
    : [];

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📈 Stock Price Prediction</h2>
      <p style={styles.sub}>
        Multiple Linear Regression using <b>Open, High, Low, Volume</b> → predicts <b>Close</b>
      </p>

      {/* Ticker selector */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={styles.select}
        >
          {TICKERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          Run Prediction
        </button>
      </form>

      {/* States */}
      {loading && <p style={styles.status}>⏳ Running model...</p>}
      {error && <p style={{ ...styles.status, color: "#e74c3c" }}>❌ {error}</p>}

      {/* Results */}
      {data && (
        <>
          {/* Info cards */}
          <div style={styles.cardRow}>
            <StatCard label="Ticker" value={data.ticker} />
            <StatCard label="R² Score" value={data.r2_score} color="#2ecc71" />
            <StatCard label="MAE" value={`$${data.mae}`} color="#e67e22" />
            <StatCard label="Train Period" value={`${data.info.train_start} → ${data.info.train_end}`} small />
            <StatCard label="Test Period" value={`${data.info.test_start} → ${data.info.test_end}`} small />
          </div>

          {/* Chart */}
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Actual vs Predicted Close Price</h3>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#aaa" }}
                  tickFormatter={(d) => d.slice(2, 10)}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#aaa" }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#1e1e2f", border: "1px solid #444", borderRadius: 8 }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke="#3498db"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Predicted"
                  stroke="#e74c3c"
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table — first 10 rows */}
          <div style={styles.tableBox}>
            <h3 style={styles.chartTitle}>Sample Predictions (first 10)</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actual Close</th>
                  <th style={styles.th}>Predicted Close</th>
                  <th style={styles.th}>Difference</th>
                </tr>
              </thead>
              <tbody>
                {data.dates.slice(0, 10).map((date, i) => {
                  const diff = (data.predicted[i] - data.actual[i]).toFixed(4);
                  const positive = diff >= 0;
                  return (
                    <tr key={date} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{date}</td>
                      <td style={styles.td}>${data.actual[i]}</td>
                      <td style={styles.td}>${data.predicted[i]}</td>
                      <td style={{ ...styles.td, color: positive ? "#2ecc71" : "#e74c3c" }}>
                        {positive ? "+" : ""}{diff}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color = "#fff", small = false }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: small ? 11 : 13, color: "#aaa", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: small ? 13 : 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    background: "#13131f",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
  },
  heading: { fontSize: 26, fontWeight: 700, marginBottom: 6 },
  sub: { color: "#aaa", marginBottom: 24, fontSize: 14 },
  form: { display: "flex", gap: 12, marginBottom: 28, alignItems: "center" },
  select: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #333",
    background: "#1e1e2f",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
  },
  button: {
    padding: "10px 22px",
    borderRadius: 8,
    background: "#3498db",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  status: { fontSize: 15, margin: "12px 0" },
  cardRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  card: {
    background: "#1e1e2f",
    border: "1px solid #2a2a3d",
    borderRadius: 10,
    padding: "14px 20px",
    minWidth: 120,
  },
  chartBox: {
    background: "#1e1e2f",
    border: "1px solid #2a2a3d",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 28,
  },
  chartTitle: { fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#ddd" },
  tableBox: {
    background: "#1e1e2f",
    border: "1px solid #2a2a3d",
    borderRadius: 12,
    padding: "20px 24px",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: 13,
    color: "#aaa",
    borderBottom: "1px solid #2a2a3d",
  },
  td: { padding: "9px 14px", fontSize: 13 },
  trEven: { background: "#181828" },
  trOdd: { background: "#1e1e2f" },
};