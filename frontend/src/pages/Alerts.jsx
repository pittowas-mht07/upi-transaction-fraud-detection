import React from 'react';
import { Link } from 'react-router-dom';

const Alerts = ({ history = [] }) => {
  // Derive real fraud alerts from history
  const fraudAlerts = history.filter(tx => tx.fraud_prediction === 1);
  const criticalAlerts = fraudAlerts.filter(tx => tx.fraud_probability > 0.8);
  const highAlerts = fraudAlerts.filter(tx => tx.fraud_probability <= 0.8 && tx.fraud_probability > 0.5);

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="dashboard-main" style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-gutter)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-h2">Fraud Alerts Management</h2>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Monitor, investigate, and resolve active security incidents and anomalies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {fraudAlerts.length > 0 && (
            <span style={{ backgroundColor: 'var(--error)', color: 'var(--on-error)', fontSize: '11px', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>circle</span>
              {fraudAlerts.length} Active Alert{fraudAlerts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">Total Alerts</span>
            <span className="material-symbols-outlined stat-icon red">notification_important</span>
          </div>
          <div className="stat-value text-h2" style={{ color: fraudAlerts.length > 0 ? 'var(--error)' : 'var(--on-surface)' }}>{fraudAlerts.length}</div>
          <div className="stat-trend warning text-label-sm" style={{ marginTop: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>fraud</span>
            {fraudAlerts.length > 0 ? 'Requires immediate attention' : 'No fraud detected'}
          </div>
        </div>
        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">Critical (≥80%)</span>
            <span className="material-symbols-outlined stat-icon red">priority_high</span>
          </div>
          <div className="stat-value text-h2" style={{ color: criticalAlerts.length > 0 ? 'var(--error)' : 'var(--on-surface)' }}>{criticalAlerts.length}</div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>High-confidence fraud</div>
        </div>
        <div className="card">
          <div className="stat-card-header">
            <span className="stat-card-title text-label-sm">High Risk (≥50%)</span>
            <span className="material-symbols-outlined stat-icon orange">warning</span>
          </div>
          <div className="stat-value text-h2">{highAlerts.length}</div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Elevated suspicion</div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-h3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>notification_important</span>
            Active Fraud Detections
          </h3>
          {fraudAlerts.length > 0 && (
            <Link to="/transactions" className="text-label-sm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              View in Ledger →
            </Link>
          )}
        </div>

        <div className="alerts-list" style={{ maxHeight: '600px', padding: 'var(--spacing-md)', gap: 'var(--spacing-sm)' }}>
          {fraudAlerts.length > 0 ? (
            fraudAlerts.map((tx, idx) => {
              const isCritical = tx.fraud_probability > 0.8;
              return (
                <div key={idx} className={`alert-item ${isCritical ? 'critical' : ''}`}>
                  <div className={`alert-icon-wrap ${isCritical ? 'critical' : 'warning'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {isCritical ? 'gpp_bad' : 'gpp_maybe'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 className="text-label-sm" style={{ color: isCritical ? 'var(--error)' : '#ea580c' }}>
                        {isCritical ? 'Critical Fraud Detected' : 'High-Risk Transaction Flagged'}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{formatTime(tx.timestamp)}</span>
                    </div>
                    <p className="text-body-md" style={{ marginBottom: '8px' }}>
                      Transaction <span className="text-data-mono">TXN-{tx.id}</span> of{' '}
                      <strong>₹{parseFloat(tx.amount).toLocaleString('en-IN')}</strong> via{' '}
                      <strong>{tx.payment_app}</strong> flagged with{' '}
                      <span style={{ color: 'var(--error)', fontWeight: 600 }}>{(tx.fraud_probability * 100).toFixed(1)}%</span> fraud confidence.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                      <span className="status-chip fraud">
                        <span className="status-dot fraud"></span> Fraud
                      </span>
                      <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        To: {tx.receiver_type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ display: 'block', fontSize: '48px', marginBottom: '12px', opacity: 0.3, color: 'var(--status-safe-dot)' }}>gpp_good</span>
              <h3 className="text-h3" style={{ marginBottom: '8px', color: 'var(--status-safe-text)' }}>All Clear</h3>
              <p className="text-body-md">No fraud detections yet. Alerts will appear here when transactions are flagged by the model.</p>
              <Link to="/dashboard" style={{ display: 'inline-block', marginTop: 'var(--spacing-md)', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                → Go to Dashboard to analyze transactions
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Alerts;
