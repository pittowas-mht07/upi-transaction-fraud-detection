import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNav = () => {
  return (
    <nav className="sidenav">
      <div className="sidenav-logo-area">
        <img
          alt="ShieldAnalytics Logo"
          className="sidenav-logo"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfqgpLPI4xUl4RM7Vq1s5Moon7iPaKULtHKfI-UjYZdMEmgPKhCv_1YHUyOxAXu2cLXJWhjEtFgBcKf25X3iCbwcFmFGzI74t-TPd-zOW4rrAPEWnKBLATqD3YPbkTbsHTZZYv0gvuIoKL78606NhG4w0hYL6wUHyE-dJeqlbH6dym6qWdhCaiJhvKl0YV-xMbq9tzkZr117mnUG36VePaUk0w5IvPGVXSOZ2lAzdsQPgs0NO-sK-Fl9zU0ozMnPKUH2iFJPqxTRc"
        />
        <div>
          <h2 className="text-h2 sidenav-title">ShieldAnalytics</h2>
          <p className="text-label-sm sidenav-subtitle">Fraud Detection Unit</p>
        </div>
      </div>
      <div className="sidenav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            dashboard
          </span>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined" data-icon="receipt_long">
            receipt_long
          </span>
          Transactions
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined" data-icon="warning">
            warning
          </span>
          Alerts
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-link text-body-md ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined" data-icon="assessment">
            assessment
          </span>
          Reports
        </NavLink>
        <a className="nav-link text-body-md" href="#">
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          Settings
        </a>
      </div>
    </nav>
  );
};

export default SideNav;
