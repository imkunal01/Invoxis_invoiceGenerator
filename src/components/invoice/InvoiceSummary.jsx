import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

/**
 * InvoiceSummary component
 * Displays the invoice summary with subtotal, tax, discount, and total
 * Allows users to set tax rate and apply additional discounts
 */
const InvoiceSummary = () => {
  const { 
    invoiceItems, 
    settings, 
    updateSettings,
    calculateSubtotal,
    calculateTax,
    calculateDiscount,
    calculateTotal
  } = useInvoice();

  // Handle settings changes
  const handleSettingChange = (field, value) => {
    // Convert to number for numeric fields
    if (['taxRate', 'discount'].includes(field)) {
      value = value === '' ? 0 : Number(value);
    }
    
    // Handle discount type toggle
    if (field === 'discountType') {
      value = value.target.value;
    }
    
    updateSettings(field, value);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        Invoice Summary
      </h3>

      <div className="invoice-summary">
        {/* Tax Rate Settings */}
        <div className="summary-settings">
          <div className="form-group">
            <label htmlFor="tax-rate">Tax Rate (%)</label>
            <input
              type="number"
              id="tax-rate"
              value={settings.taxRate}
              onChange={(e) => handleSettingChange('taxRate', e.target.value)}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Additional Discount</label>
            <div className="discount-group">
              <input
                type="number"
                id="discount"
                value={settings.discount}
                onChange={(e) => handleSettingChange('discount', e.target.value)}
                min="0"
                step="0.01"
              />
              <select 
                value={settings.discountType} 
                onChange={(e) => handleSettingChange('discountType', e)}
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Calculations */}
        <div className="summary-calculations">
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
      </div>
    </div>
  );
};

export default InvoiceSummary;