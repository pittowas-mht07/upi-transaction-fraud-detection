import React, { useMemo } from 'react';
import FraudDetectionForm from '../components/FraudDetectionForm';
import ResultCard from '../components/ResultCard';
import { Link } from 'react-router-dom';

const Dashboard = ({ onAnalyze, isLoading, predictionResult, history = [] }) => {
  // Derive real stats from history
  const stats = useMemo(() => {
    const total = history.length;
    const flagged = history.filter(tx => tx.fraud_prediction === 1).length;
    const fraudRate = total > 0 ? ((flagged / total) * 100).toFixed(1) : 0;
    const riskScore = total > 0 ? Math.min(100, Math.round((flagged / total) * 100 * 1.5 + 10)) : 0;
    return { total, flagged, fraudRate, riskScore };
  }, [history]);

  return (
    <main className="dashboard-main">
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="text-h1">Dashboard Overview</h1>
          <p className="text-body-lg">System security status and real-time anomaly detection.</p>
        </div>
        <button className="btn-primary">
          <span className="material-symbols-outlined">download</span>
          Export Report
        </button>
      </div>

      {/* Hero Stats — all derived from real data */}
      <div className="stats-row" style={{ marginBottom: 'var(--grid-gutter)' }}>
        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">Transactions Analyzed</span>
            <span className="material-symbols-outlined stat-icon blue">swap_horiz</span>
          </div>
          <div>
            <div className="stat-value text-h2">{stats.total.toLocaleString()}</div>
            <div className="stat-trend positive text-label-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>analytics</span>
              {stats.total === 0 ? 'Submit a transaction to begin' : 'Total predictions run'}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">Flagged as Fraud</span>
            <span className="material-symbols-outlined stat-icon orange">gpp_maybe</span>
          </div>
          <div>
            <div className="stat-value text-h2">{stats.flagged.toLocaleString()}</div>
            <div className={`stat-trend text-label-sm ${stats.flagged > 0 ? 'warning' : 'positive'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {stats.flagged > 0 ? 'warning' : 'check_circle'}
              </span>
              {stats.flagged > 0 ? 'Requires Review' : 'No Fraud Detected'}
            </div>
          </div>
        </div>

        <div className="card" style={{ borderColor: stats.riskScore > 50 ? 'var(--error)' : 'var(--outline-variant)' }}>
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">System Risk Score</span>
            <span className="material-symbols-outlined stat-icon red">security</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
              <span className="text-h1" style={{ color: stats.riskScore > 50 ? 'var(--error)' : 'var(--on-surface)' }}>
                {stats.riskScore}
              </span>
              <span className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>/100</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${stats.riskScore}%`, backgroundColor: stats.riskScore > 50 ? 'var(--error)' : 'var(--primary)' }}></div>
            </div>
            <div className="text-label-sm" style={{ color: stats.riskScore > 50 ? 'var(--error)' : 'var(--on-surface-variant)' }}>
              {stats.riskScore > 70 ? 'Critical Risk Level' : stats.riskScore > 40 ? 'Elevated Risk Level' : 'Normal Risk Level'}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">Fraud Rate</span>
            <span className="material-symbols-outlined stat-icon gray">fact_check</span>
          </div>
          <div>
            <div className="stat-value text-h2">{stats.fraudRate}%</div>
            <div className={`stat-trend text-label-sm ${parseFloat(stats.fraudRate) < 5 ? 'positive' : 'warning'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {parseFloat(stats.fraudRate) < 5 ? 'trending_down' : 'trending_up'}
              </span>
              {stats.total > 0 ? `${stats.flagged} of ${stats.total} transactions` : 'No data yet'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-container" style={{ marginBottom: 'var(--grid-gutter)' }}>
        {/* Fraud Breakdown Chart */}
        <div className="col-6 card">
          <div className="chart-header">
            <h3 className="text-h3" style={{ color: 'var(--on-surface)' }}>Detection Activity</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
              <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {stats.total} total records
              </span>
            </div>
          </div>
          <div className="chart-body">
            {history.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: 'var(--spacing-sm)', opacity: 0.4 }}>analytics</span>
                <p className="text-body-md">Submit transactions to see detection activity</p>
              </div>
            ) : (
              /* Dynamic bar chart based on last 10 transactions */
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100%', padding: '0 var(--spacing-sm)' }}>
                {history.slice(0, 10).reverse().map((tx, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: `${20 + Math.min(tx.fraud_probability * 100, 80)}%`,
                      backgroundColor: tx.fraud_prediction === 1 ? 'var(--error)' : 'var(--primary)',
                      borderRadius: '3px 3px 0 0',
                      opacity: 0.8,
                      transition: 'height 0.3s ease'
                    }} title={`₹${tx.amount} — ${tx.fraud_prediction === 1 ? 'Fraud' : 'Safe'}`}></div>
                    <span style={{ fontSize: '9px', color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>
                      #{tx.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fraud Detection Analysis Form */}
        <div className="col-6 card">
          <h3 className="text-h3" style={{ color: 'var(--on-surface)', marginBottom: 'var(--spacing-md)' }}>Manual Analysis</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <FraudDetectionForm onSubmit={onAnalyze} isLoading={isLoading} />
            {predictionResult && (
               <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <ResultCard result={predictionResult} />
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-container">
        {/* Live Transaction Feed — real data */}
        <div className="col-6 card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-h3" style={{ color: 'var(--on-surface)' }}>Live Transaction Feed</h3>
            <Link to="/transactions" className="text-label-sm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-label-sm">Tx ID</th>
                  <th className="text-label-sm">Amount</th>
                  <th className="text-label-sm">App</th>
                  <th className="text-label-sm">Status</th>
                  <th className="text-label-sm" style={{ textAlign: 'right' }}>Time</th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {history.length > 0 ? (
                  history.slice(0, 6).map((tx, idx) => (
                    <tr key={idx}>
                      <td className="text-data-mono" style={{ color: 'var(--primary)' }}>#TRX-{tx.id}</td>
                      <td className="text-data-mono" style={{ color: tx.fraud_prediction === 1 ? 'var(--error)' : 'inherit', fontWeight: tx.fraud_prediction === 1 ? 600 : 400 }}>
                        ₹{parseFloat(tx.amount).toLocaleString('en-IN')}
                      </td>
                      <td style={{ color: 'var(--on-surface-variant)' }}>{tx.payment_app}</td>
                      <td>
                        {tx.fraud_prediction === 1 ? (
                          <span className="status-chip fraud">
                            <span className="status-dot fraud"></span> Fraud
                          </span>
                        ) : (
                          <span className="status-chip safe">
                            <span className="status-dot safe"></span> Safe
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--on-surface-variant)', fontSize: '12px' }}>
                        {new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ display: 'block', fontSize: '36px', marginBottom: '8px', opacity: 0.4 }}>receipt_long</span>
                      No transactions yet. Use the Manual Analysis form to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Fraud Breakdown */}
        <div className="col-6 card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-h3" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>pie_chart</span>
              Detection Summary
            </h3>
          </div>

          <div style={{ padding: 'var(--spacing-md)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Safe vs Fraud split */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Safe Transactions</span>
                <span className="text-label-sm">{stats.total - stats.flagged}</span>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: stats.total > 0 ? `${((stats.total - stats.flagged) / stats.total) * 100}%` : '0%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Fraudulent</span>
                <span className="text-label-sm" style={{ color: 'var(--error)' }}>{stats.flagged}</span>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: stats.total > 0 ? `${(stats.flagged / stats.total) * 100}%` : '0%', backgroundColor: 'var(--error)' }}></div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--outline-variant)', margin: '0' }} />

            {/* Recent app breakdown */}
            <div>
              <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>By Payment App</p>
              {history.length > 0 ? (
                Object.entries(
                  history.reduce((acc, tx) => {
                    acc[tx.payment_app] = (acc[tx.payment_app] || 0) + 1;
                    return acc;
                  }, {})
                ).slice(0, 4).map(([app, count]) => (
                  <div key={app} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-body-md" style={{ color: 'var(--on-surface)' }}>{app}</span>
                    <span className="text-data-mono" style={{ color: 'var(--on-surface-variant)' }}>{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
