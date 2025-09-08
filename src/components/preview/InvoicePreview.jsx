import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import './InvoicePreview.css';

/**
 * InvoicePreview component
 * Displays a printable preview of the invoice
 * Shows company info, client info, items, and totals
 */
const InvoicePreview = () => {
  const { 
    companyInfo, 
    clientInfo, 
    invoiceItems, 
    settings,
    calculateSubtotal,
    calculateTax,
    calculateDiscount,
    calculateTotal,
    generatePdf
  } = useInvoice();

  // Format date for invoice
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    return `INV-${Date.now().toString().slice(-6)}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="invoice-preview">
      <div className="preview-actions">
        <button onClick={generatePdf} className="primary-button">
          Download PDF
        </button>
        <button onClick={() => window.print()} className="secondary-button">
          Print
        </button>
      </div>

      <div className="preview-container" id="invoice-to-print">
        {/* Invoice Header */}
        <div className="preview-header">
          <div className="company-info">
            {companyInfo.logo && (
              <div className="company-logo">
                <img src={companyInfo.logo} alt="Company Logo" />
              </div>
            )}
            <h2>{companyInfo.name || 'Your Company Name'}</h2>
            <p>{companyInfo.address || 'Company Address'}</p>
            <p>{companyInfo.country || 'Country'} {companyInfo.country === 'India' && companyInfo.pinCode ? `- ${companyInfo.pinCode}` : ''}</p>
            <p>Email: {companyInfo.email || 'company@example.com'}</p>
            <p>Phone: {companyInfo.phone || '+1234567890'}</p>
          </div>
          <div className="invoice-info">
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> {generateInvoiceNumber()}</p>
            <p><strong>Date:</strong> {formatDate()}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="preview-client-info">
          <h3>Bill To:</h3>
          <p><strong>{clientInfo.name || 'Client Name'}</strong></p>
          <p>{clientInfo.address || 'Client Address'}</p>
          <p>{clientInfo.country || 'Country'} {clientInfo.country === 'India' && clientInfo.pinCode ? `- ${clientInfo.pinCode}` : ''}</p>
          <p>Email: {clientInfo.email || 'client@example.com'}</p>
          <p>Phone: {clientInfo.phone || '+1234567890'}</p>
        </div>

        {/* Invoice Items */}
        <div className="preview-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-items">No items added to this invoice</td>
                </tr>
              ) : (
                invoiceItems.map((item) => {
                  const itemTotal = (item.quantity * item.price) - (item.discount || 0);
                  return (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.discount ? formatCurrency(item.discount) : '-'}</td>
                      <td>{formatCurrency(itemTotal)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="preview-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="summary-row">
            <span>Tax ({settings.taxRate}%):</span>
            <span>{formatCurrency(calculateTax())}</span>
          </div>
          <div className="summary-row">
            <span>
              Discount 
              {settings.discountType === 'percentage' ? 
                ` (${settings.discount}%)` : 
                ''}:
            </span>
            <span>{formatCurrency(calculateDiscount())}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="preview-footer">
          <p>Thank you for your business!</p>
          <p>Payment is due within 30 days of invoice date.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;