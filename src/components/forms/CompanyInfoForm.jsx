import React, { useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';

/**
 * CompanyInfoForm component
 * Allows users to input company information with validation
 */
const CompanyInfoForm = () => {
  const { 
    companyInfo, 
    setCompanyInfo, 
    errors, 
    validateCompanyInfo,
    handleLogoUpload,
    removeLogo
  } = useInvoice();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle country change - clear PIN code if not India
  useEffect(() => {
    if (companyInfo.country !== 'India') {
      setCompanyInfo(prev => ({ ...prev, pinCode: '' }));
    }
  }, [companyInfo.country, setCompanyInfo]);

  // Validate on blur
  const handleBlur = () => {
    validateCompanyInfo();
  };

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        Company Information
      </h3>

      {/* Logo Upload Section */}
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="company-logo">Company Logo</label>
          <div className="logo-upload-container">
            {companyInfo.logo ? (
              <div className="logo-preview">
                <img src={companyInfo.logo} alt="Company Logo" className="logo-image" />
                <button type="button" onClick={removeLogo} className="remove-logo-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="logo-upload-area">
                <input
                  type="file"
                  id="company-logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="logo-input"
                />
                <label htmlFor="company-logo" className="logo-upload-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                  <span>Click to upload logo</span>
                  <small>PNG, JPG, SVG up to 2MB</small>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="company-name">Company Name*</label>
          <input
            type="text"
            id="company-name"
            name="name"
            value={companyInfo.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter company name"
            className={errors.companyInfo?.name ? 'error' : ''}
          />
          {errors.companyInfo?.name && (
            <div className="error-message">{errors.companyInfo.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="company-email">Email*</label>
          <input
            type="email"
            id="company-email"
            name="email"
            value={companyInfo.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter email address"
            className={errors.companyInfo?.email ? 'error' : ''}
          />
          {errors.companyInfo?.email && (
            <div className="error-message">{errors.companyInfo.email}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="company-phone">Phone*</label>
          <input
            type="tel"
            id="company-phone"
            name="phone"
            value={companyInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter phone number"
            className={errors.companyInfo?.phone ? 'error' : ''}
          />
          {errors.companyInfo?.phone && (
            <div className="error-message">{errors.companyInfo.phone}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="company-country">Country*</label>
          <select
            id="company-country"
            name="country"
            value={companyInfo.country}
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
          <label htmlFor="company-address">Address*</label>
          <textarea
            id="company-address"
            name="address"
            value={companyInfo.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter complete address"
            rows="3"
            className={errors.companyInfo?.address ? 'error' : ''}
          ></textarea>
          {errors.companyInfo?.address && (
            <div className="error-message">{errors.companyInfo.address}</div>
          )}
        </div>
      </div>

      {companyInfo.country === 'India' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company-pincode">PIN Code*</label>
            <input
              type="text"
              id="company-pincode"
              name="pinCode"
              value={companyInfo.pinCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter PIN code"
              className={errors.companyInfo?.pinCode ? 'error' : ''}
            />
            {errors.companyInfo?.pinCode && (
              <div className="error-message">{errors.companyInfo.pinCode}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoForm;