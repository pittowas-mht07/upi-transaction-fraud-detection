import React, { useState } from 'react';

const INITIAL_STATE = {
  timeOfDay: '12:00',
  amount: 1500,
  receiver_type: 'User',
  payment_app: 'GPay',
  device_type: 'Android',
  user_city_tier: 'Tier 1',
  user_kyc_status: 'Verified'
};

const FraudDetectionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' || type === 'number' ? Number(value) : value
    }));
  };

  const fillExample = (type) => {
    if (type === 'safe') {
      setFormData({
        timeOfDay: '14:30',
        amount: 500,
        receiver_type: 'User',
        payment_app: 'GPay',
        device_type: 'Android',
        user_city_tier: 'Tier 1',
        user_kyc_status: 'Verified'
      });
    } else {
      setFormData({
        timeOfDay: '03:15',
        amount: 45000,
        receiver_type: 'Merchant',
        payment_app: 'Other',
        device_type: 'Web',
        user_city_tier: 'Tier 3',
        user_kyc_status: 'Not Verified'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the payload expected by the backend
    const today = new Date().toISOString().split('T')[0];
    
    const backendPayload = {
      amount: formData.amount,
      transaction_time: `${today}T${formData.timeOfDay}`,
      receiver_type: formData.receiver_type,
      payment_app: formData.payment_app,
      device_type: formData.device_type,
      user_city_tier: formData.user_city_tier,
      user_kyc_status: formData.user_kyc_status
    };

    onSubmit(backendPayload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="actions" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button type="button" className="btn-sm" onClick={() => fillExample('safe')}>
          Fill Safe Txn
        </button>
        <button type="button" className="btn-sm" onClick={() => fillExample('fraud')} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          Fill High-Risk Txn
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Time of Day (24h)
          </label>
          <input 
            type="time" 
            name="timeOfDay" 
            className="form-control" 
            value={formData.timeOfDay} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Transaction Amount (₹)
          </label>
          <input 
            type="number" 
            name="amount" 
            className="form-control" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Receiver Type
          </label>
          <select 
            name="receiver_type" 
            className="form-control" 
            value={formData.receiver_type} 
            onChange={handleChange}
          >
            <option value="User">User (P2P)</option>
            <option value="Merchant">Merchant (P2M)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Payment App
          </label>
          <select 
            name="payment_app" 
            className="form-control" 
            value={formData.payment_app} 
            onChange={handleChange}
          >
            <option value="GPay">GPay</option>
            <option value="PhonePe">PhonePe</option>
            <option value="Paytm">Paytm</option>
            <option value="BHIM">BHIM</option>
            <option value="WhatsApp Pay">WhatsApp Pay</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            Device Type
          </label>
          <select 
            name="device_type" 
            className="form-control" 
            value={formData.device_type} 
            onChange={handleChange}
          >
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
            <option value="Web">Web</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            User City Tier
          </label>
          <select 
            name="user_city_tier" 
            className="form-control" 
            value={formData.user_city_tier} 
            onChange={handleChange}
          >
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            KYC Status
          </label>
          <select 
            name="user_kyc_status" 
            className="form-control" 
            value={formData.user_kyc_status} 
            onChange={handleChange}
          >
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
        {isLoading ? (
          <>
            <div className="spinner"></div> Processing...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Analyze UPI Pattern
          </>
        )}
      </button>
    </form>
  );
};

export default FraudDetectionForm;
