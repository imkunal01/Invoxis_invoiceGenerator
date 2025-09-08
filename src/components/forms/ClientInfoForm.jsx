import React, { useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';

/**
 * ClientInfoForm component
 * Allows users to input client information with validation
 * Shows/hides PIN code field based on country selection
 */
const ClientInfoForm = () => {
  const { 
    clientInfo, 
    setClientInfo, 
    errors, 
    validateClientInfo,
    getRecentClients
  } = useInvoice();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle country change - clear PIN code if not India
  useEffect(() => {
    if (clientInfo.country !== 'India') {
      setClientInfo(prev => ({ ...prev, pinCode: '' }));
    }
  }, [clientInfo.country, setClientInfo]);

  // Validate on blur
  const handleBlur = () => {
    validateClientInfo();
  };

  // Load a recent client
  const handleLoadRecentClient = (e) => {
    const selectedClientEmail = e.target.value;
    if (!selectedClientEmail) return;
    
    const recentClients = getRecentClients();
    const selectedClient = recentClients.find(client => client.email === selectedClientEmail);
    
    if (selectedClient) {
      setClientInfo(selectedClient);
    }
    
    // Reset the select element
    e.target.value = '';
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Client Information
      </h3>

      {/* Recent Clients Dropdown */}
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="recent-clients">Load Recent Client</label>
          <select 
            id="recent-clients" 
            onChange={handleLoadRecentClient}
            defaultValue=""
          >
            <option value="">Select a recent client...</option>
            {getRecentClients().map((client, index) => (
              <option key={index} value={client.email}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="client-name">Client Name*</label>
          <input
            type="text"
            id="client-name"
            name="name"
            value={clientInfo.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter client name"
            className={errors.clientInfo?.name ? 'error' : ''}
          />
          {errors.clientInfo?.name && (
            <div className="error-message">{errors.clientInfo.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="client-email">Email*</label>
          <input
            type="email"
            id="client-email"
            name="email"
            value={clientInfo.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter email address"
            className={errors.clientInfo?.email ? 'error' : ''}
          />
          {errors.clientInfo?.email && (
            <div className="error-message">{errors.clientInfo.email}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="client-phone">Phone*</label>
          <input
            type="tel"
            id="client-phone"
            name="phone"
            value={clientInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter phone number"
            className={errors.clientInfo?.phone ? 'error' : ''}
          />
          {errors.clientInfo?.phone && (
            <div className="error-message">{errors.clientInfo.phone}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="client-country">Country*</label>
          <select
            id="client-country"
            name="country"
            value={clientInfo.country}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="client-address">Address*</label>
          <textarea
            id="client-address"
            name="address"
            value={clientInfo.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter complete address"
            rows="3"
            className={errors.clientInfo?.address ? 'error' : ''}
          ></textarea>
          {errors.clientInfo?.address && (
            <div className="error-message">{errors.clientInfo.address}</div>
          )}
        </div>
      </div>

      {/* Conditional PIN Code field for India */}
      {clientInfo.country === 'India' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="client-pincode">PIN Code*</label>
            <input
              type="text"
              id="client-pincode"
              name="pinCode"
              value={clientInfo.pinCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter PIN code"
              className={errors.clientInfo?.pinCode ? 'error' : ''}
            />
            {errors.clientInfo?.pinCode && (
              <div className="error-message">{errors.clientInfo.pinCode}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInfoForm;