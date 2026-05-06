import React from 'react';

const TransactionHistory = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <div className="panel" style={{ marginTop: '1.5rem' }}>
      <div className="panel-header">
        <span style={{ color: 'var(--text-muted)' }}>🕒</span> Recent Transactions
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0' }}>Time</th>
              <th style={{ padding: '0.75rem 0' }}>Amount</th>
              <th style={{ padding: '0.75rem 0' }}>Receiver</th>
              <th style={{ padding: '0.75rem 0' }}>App</th>
              <th style={{ padding: '0.75rem 0' }}>Risk Score</th>
              <th style={{ padding: '0.75rem 0' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{txn.timestamp.split(' ')[1]}</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>₹{txn.amount}</td>
                <td style={{ padding: '0.75rem 0' }}>{txn.receiver_type}</td>
                <td style={{ padding: '0.75rem 0' }}>{txn.payment_app}</td>
                <td style={{ padding: '0.75rem 0' }}>{(txn.fraud_probability * 100).toFixed(1)}%</td>
                <td style={{ padding: '0.75rem 0' }}>
                  {txn.fraud_prediction === 1 ? (
                    <span style={{ 
                      background: 'var(--danger-light)', 
                      color: '#fca5a5', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>BLOCKED</span>
                  ) : (
                    <span style={{ 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      color: 'var(--success)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>SAFE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
