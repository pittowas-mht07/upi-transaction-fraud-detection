import React, { useState, useMemo } from 'react';

const Transactions = ({ history = [] }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let data = [...history];
    if (filterStatus === 'fraud') data = data.filter(tx => tx.fraud_prediction === 1);
    if (filterStatus === 'safe')  data = data.filter(tx => tx.fraud_prediction === 0);
    if (sortOrder === 'newest') data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (sortOrder === 'oldest') data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (sortOrder === 'highest') data.sort((a, b) => b.amount - a.amount);
    if (sortOrder === 'lowest')  data.sort((a, b) => a.amount - b.amount);
    return data;
  }, [history, filterStatus, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const getRiskLevel = (tx) => {
    if (tx.fraud_prediction === 1) {
      if (tx.fraud_probability > 0.8) return { label: 'Critical', color: '#991b1b', bg: 'var(--error-container)' };
      return { label: 'High', color: 'var(--error)', bg: 'var(--error-container)' };
    }
    if (tx.fraud_probability > 0.4) return { label: 'Medium', color: '#ea580c', bg: '#fff7ed' };
    return { label: 'Low', color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)' };
  };

  return (
    <main className="dashboard-main" style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-gutter)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-h2">Transactions Ledger</h2>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Review and investigate all analyzed financial activity.
          </p>
        </div>
        <button className="btn-secondary">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          Export CSV
        </button>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div className="text-h3">{history.length}</div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Total Analyzed</div>
        </div>
        <div className="card" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', flex: 1, minWidth: '150px', textAlign: 'center', borderColor: 'var(--error)' }}>
          <div className="text-h3" style={{ color: 'var(--error)' }}>{history.filter(t => t.fraud_prediction === 1).length}</div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Fraud Detected</div>
        </div>
        <div className="card" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div className="text-h3" style={{ color: 'var(--primary)' }}>{history.filter(t => t.fraud_prediction === 0).length}</div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Safe</div>
        </div>
        <div className="card" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div className="text-h3">
            ₹{history.reduce((sum, t) => sum + parseFloat(t.amount), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Total Volume</div>
        </div>
      </div>

      {/* Smart Filters Bar */}
      <div style={{ backgroundColor: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)', fontSize: '20px' }}>filter_list</span>
          <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
        </div>

        <div style={{ position: 'relative' }}>
          <select
            className="form-control"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            style={{ minWidth: '160px', paddingRight: '30px', appearance: 'none' }}
          >
            <option value="all">All Transactions</option>
            <option value="fraud">Fraud Only</option>
            <option value="safe">Safe Only</option>
          </select>
          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}>arrow_drop_down</span>
        </div>

        <div style={{ position: 'relative' }}>
          <select
            className="form-control"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{ minWidth: '160px', paddingRight: '30px', appearance: 'none' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}>arrow_drop_down</span>
        </div>

        <button onClick={() => { setFilterStatus('all'); setSortOrder('newest'); setPage(1); }}
          className="text-label-sm" style={{ marginLeft: 'auto', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Clear Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ flex: 1 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th className="text-label-sm">Date / Time</th>
                <th className="text-label-sm">Transaction ID</th>
                <th className="text-label-sm">Payment App</th>
                <th className="text-label-sm">Receiver Type</th>
                <th className="text-label-sm" style={{ textAlign: 'right' }}>Amount</th>
                <th className="text-label-sm">Risk Level</th>
                <th className="text-label-sm">Status</th>
                <th className="text-label-sm" style={{ textAlign: 'right' }}>Confidence</th>
              </tr>
            </thead>
            <tbody className="text-body-md">
              {paged.length > 0 ? (
                paged.map((tx, idx) => {
                  const risk = getRiskLevel(tx);
                  return (
                    <tr key={idx}>
                      <td style={{ color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>
                        {new Date(tx.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="text-data-mono" style={{ color: 'var(--primary)' }}>TXN-{tx.id}</td>
                      <td>{tx.payment_app}</td>
                      <td style={{ color: 'var(--on-surface-variant)' }}>{tx.receiver_type}</td>
                      <td className="text-data-mono" style={{ textAlign: 'right', color: tx.fraud_prediction === 1 ? 'var(--error)' : 'inherit', fontWeight: tx.fraud_prediction === 1 ? 600 : 400 }}>
                        ₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '999px', backgroundColor: risk.bg, color: risk.color }} className="text-label-sm">
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: risk.color, flexShrink: 0 }}></span>
                          {risk.label}
                        </span>
                      </td>
                      <td>
                        {tx.fraud_prediction === 1 ? (
                          <span className="status-chip fraud"><span className="status-dot fraud"></span> Fraud</span>
                        ) : (
                          <span className="status-chip safe"><span className="status-dot safe"></span> Safe</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="text-data-mono" style={{ color: tx.fraud_probability > 0.5 ? 'var(--error)' : 'var(--on-surface-variant)' }}>
                          {(tx.fraud_probability * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ display: 'block', fontSize: '40px', marginBottom: '8px', opacity: 0.4 }}>receipt_long</span>
                    {history.length === 0 ? 'No transactions analyzed yet. Submit a transaction from the Dashboard.' : 'No transactions match your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderTop: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Showing {paged.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} transactions
          </span>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
            <button className="icon-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-label-sm" style={{ padding: '0 var(--spacing-xs)' }}>{page} / {totalPages || 1}</span>
            <button className="icon-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Transactions;
