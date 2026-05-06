import React from 'react';

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="topnav-search">
        <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>
          search
        </span>
        <input className="text-body-md" placeholder="Search transactions, users, or alerts..." type="text" />
      </div>
      <div className="topnav-actions">
        <button className="icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="icon-btn">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
