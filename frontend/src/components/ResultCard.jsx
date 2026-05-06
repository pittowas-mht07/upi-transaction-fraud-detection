import React from 'react';

const ResultCard = ({ prediction, isLoading }) => {
  if (isLoading) {
    return (
      <div className="ai-factors" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p>Running random forest inference...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="ai-factors">
        <p style={{ marginBottom: '1.5rem' }}>
          Feature importance weights for the current Random Forest model will appear here after analysis.
        </p>
        <div style={{ height: '200px', borderLeft: '1px solid var(--card-border)', marginLeft: '2rem', position: 'relative' }}>
          {/* Decorative line to match the empty state in screenshot */}
        </div>
      </div>
    );
  }

  const isFraud = prediction.fraud_prediction === 1;
  const probability = (prediction.fraud_probability * 100).toFixed(1);

  return (
    <div className="ai-factors">
      <p style={{ marginBottom: '1.5rem' }}>
        Analysis complete. Model confidence and risk breakdown:
      </p>

      <div className={`result-box ${isFraud ? 'result-fraud' : 'result-safe'}`}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {isFraud ? '⚠️ HIGH RISK DETECTED' : '✅ PATTERN VERIFIED'}
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>
          {isFraud 
            ? 'Transaction matches known anomaly clusters.'
            : 'Transaction aligns with standard behavior.'}
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Calculated Risk Probability</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{probability}%</span>
        </div>
        <div className="prob-bar">
          <div 
            className="prob-fill" 
            style={{ 
              width: `${probability}%`, 
              background: isFraud ? 'var(--danger)' : 'var(--success)' 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
