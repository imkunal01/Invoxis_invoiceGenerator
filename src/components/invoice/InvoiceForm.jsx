import React from 'react';
import CompanyInfoForm from '../forms/CompanyInfoForm';
import ClientInfoForm from '../forms/ClientInfoForm';
import InvoiceItems from './InvoiceItems';
import InvoiceSummary from './InvoiceSummary';
import { useInvoice } from '../../context/InvoiceContext';
import './InvoiceForm.css';

/**
 * InvoiceForm component
 * Main form container that combines all form sections
 * Handles form submission and validation
 */
const InvoiceForm = () => {
  const { validateAll, generatePdf } = useInvoice();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all form fields
    const isValid = validateAll();
    
    if (isValid) {
      // Generate PDF if validation passes
      generatePdf();
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  };

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <div className="form-container">
        {/* Company Information Section */}
        <CompanyInfoForm />
        
        {/* Client Information Section */}
        <ClientInfoForm />
        
        {/* Invoice Items Section */}
        <InvoiceItems />
        
        {/* Invoice Summary Section */}
        <InvoiceSummary />
        
        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="primary-button">
            Generate Invoice
          </button>
          <button type="button" className="secondary-button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;