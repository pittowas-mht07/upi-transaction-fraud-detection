import React from 'react';

const Reports = () => {
  return (
    <main className="dashboard-main flex-1 overflow-y-auto flex flex-col gap-lg" style={{ padding: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-h2">Compliance & Reports</h2>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Generate and view historical fraud analysis reports and compliance documents.</p>
        </div>
        <button className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Report
        </button>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
         <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--on-surface-variant)', marginBottom: 'var(--spacing-md)' }}>assessment</span>
         <h3 className="text-h3" style={{ marginBottom: 'var(--spacing-sm)' }}>No Reports Generated</h3>
         <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '400px' }}>You haven't generated any compliance reports yet. Click "New Report" to run a historical analysis.</p>
      </div>
    </main>
  );
};

export default Reports;
