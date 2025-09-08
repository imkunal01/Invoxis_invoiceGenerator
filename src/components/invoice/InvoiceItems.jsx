import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import './InvoiceForm.css';

/**
 * InvoiceItems component
 * Allows users to add, edit, and remove invoice items
 * Calculates item totals automatically
 */
const InvoiceItems = () => {
  const { 
    invoiceItems, 
    addInvoiceItem, 
    updateInvoiceItem, 
    removeInvoiceItem,
    errors
  } = useInvoice();

  // Handle input changes for an item
  const handleItemChange = (id, field, value) => {
    // Convert to number for numeric fields
    if (['quantity', 'price', 'discount'].includes(field)) {
      value = value === '' ? 0 : Number(value);
    }
    
    // Handle checkbox for taxable field
    if (field === 'taxable') {
      value = value.target.checked;
    }
    
    updateInvoiceItem(id, field, value);
  };

  // Calculate item total
  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.price;
    const discount = item.discount || 0;
    return subtotal - discount;
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Invoice Items
      </h3>

      {/* Error message if no items */}
      {errors.invoiceItems?.length > 0 && errors.invoiceItems[0]?.general && (
        <div className="error-message mb-4">{errors.invoiceItems[0].general}</div>
      )}

      <div className="invoice-items">
        {invoiceItems.length === 0 ? (
          <div className="empty-items-message">
            <p>No items yet. Click "Add Item" to add your first invoice item.</p>
          </div>
        ) : (
          invoiceItems.map((item, index) => (
            <div key={item.id} className="invoice-item">
              <button 
                type="button" 
                className="invoice-item-remove" 
                onClick={() => removeInvoiceItem(item.id)}
                aria-label="Remove item"
              >
                ×
              </button>
              
              <div className="form-group full-width">
                <label htmlFor={`item-description-${item.id}`}>Description*</label>
                <input
                  type="text"
                  id={`item-description-${item.id}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                  className={errors.invoiceItems?.[index]?.description ? 'error' : ''}
                />
                {errors.invoiceItems?.[index]?.description && (
                  <div className="error-message">{errors.invoiceItems[index].description}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`item-quantity-${item.id}`}>Quantity*</label>
                <input
                  type="number"
                  id={`item-quantity-${item.id}`}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  min="1"
                  step="1"
                  className={errors.invoiceItems?.[index]?.quantity ? 'error' : ''}
                />
                {errors.invoiceItems?.[index]?.quantity && (
                  <div className="error-message">{errors.invoiceItems[index].quantity}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`item-price-${item.id}`}>Price*</label>
                <input
                  type="number"
                  id={`item-price-${item.id}`}
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  min="0"
                  step="0.01"
                  className={errors.invoiceItems?.[index]?.price ? 'error' : ''}
                />
                {errors.invoiceItems?.[index]?.price && (
                  <div className="error-message">{errors.invoiceItems[index].price}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`item-discount-${item.id}`}>Discount</label>
                <input
                  type="number"
                  id={`item-discount-${item.id}`}
                  value={item.discount || 0}
                  onChange={(e) => handleItemChange(item.id, 'discount', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={item.taxable}
                    onChange={(e) => handleItemChange(item.id, 'taxable', e)}
                  />
                  Taxable
                </label>
              </div>
              
              <div className="form-group">
                <label>Total</label>
                <div className="item-total">
                  {calculateItemTotal(item).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        type="button" 
        className="add-item-button" 
        onClick={addInvoiceItem}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Item
      </button>
    </div>
  );
};

export default InvoiceItems;