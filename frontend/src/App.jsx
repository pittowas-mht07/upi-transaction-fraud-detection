import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/layout/SideNav';
import TopNav from './components/layout/TopNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get prediction');
      }
      
      const data = await response.json();
      setPrediction(data);
      
      // Refresh history table
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Error connecting to the server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <SideNav />
      <div className="main-content-wrapper">
        <TopNav />
        {error && (
           <div style={{ backgroundColor: 'var(--error-container)', color: 'var(--on-error-container)', padding: 'var(--spacing-sm)', margin: 'var(--spacing-md)' }}>
              {error}
           </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard onAnalyze={handlePredict} isLoading={isLoading} predictionResult={prediction} history={history} />} />
          <Route path="/transactions" element={<Transactions history={history} />} />
          <Route path="/alerts" element={<Alerts history={history} />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
