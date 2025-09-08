import React, { createContext, useState, useContext, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Create context
const InvoiceContext = createContext();

/**
 * InvoiceProvider component that manages the global state for the invoice
 * Handles company info, client info, invoice items, and calculations
 */
export const InvoiceProvider = ({ children }) => {
  // Company Information
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    country: 'India',
    pinCode: '',
    logo: null
  });

  // Client Information
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    country: 'India',
    pinCode: ''
  });

  // Invoice Items
  const [invoiceItems, setInvoiceItems] = useState([]);

  // Invoice Settings
  const [settings, setSettings] = useState({
    taxRate: 18, // Default GST rate in India
    discountType: 'percentage', // 'percentage' or 'fixed'
    discount: 0,
    currency: 'INR',
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  });
  
  // Update settings
  const updateSettings = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyInfo(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove logo
  const removeLogo = () => {
    setCompanyInfo(prev => ({
      ...prev,
      logo: null
    }));
  };

  // Validation errors
  const [errors, setErrors] = useState({
    companyInfo: {},
    clientInfo: {},
    invoiceItems: []
  });

  // Calculated totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0
  });

  // Generate a random invoice number
  function generateInvoiceNumber() {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Add a new invoice item
  const addInvoiceItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      taxable: true,
      discount: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Update an invoice item
  const updateInvoiceItem = (id, field, value) => {
    const updatedItems = invoiceItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setInvoiceItems(updatedItems);
  };

  // Remove an invoice item
  const removeInvoiceItem = (id) => {
    const filteredItems = invoiceItems.filter(item => item.id !== id);
    setInvoiceItems(filteredItems);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.price) - (item.discount || 0));
    }, 0);
  };

  // Calculate tax amount
  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (settings.taxRate / 100);
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (settings.discountType === 'percentage') {
      return subtotal * (settings.discount / 100);
    } else {
      return settings.discount;
    }
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  // Calculate invoice totals
  useEffect(() => {
    // Update totals state
    setTotals({
      subtotal: calculateSubtotal(),
      taxAmount: calculateTax(),
      discountAmount: calculateDiscount(),
      total: calculateTotal()
    });
  }, [invoiceItems, settings]);

  // Validate company information
  const validateCompanyInfo = () => {
    const errors = {};
    
    if (!companyInfo.name) errors.name = 'Company name is required';
    if (!companyInfo.address) errors.address = 'Address is required';
    if (!companyInfo.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(companyInfo.email)) errors.email = 'Email is invalid';
    if (!companyInfo.phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(companyInfo.phone)) errors.phone = 'Phone number must be 10 digits';
    if (companyInfo.country === 'India' && !companyInfo.pinCode) errors.pinCode = 'PIN code is required';
    
    setErrors(prev => ({ ...prev, companyInfo: errors }));
    return Object.keys(errors).length === 0;
  };

  // Validate client information
  const validateClientInfo = () => {
    const errors = {};
    
    if (!clientInfo.name) errors.name = 'Client name is required';
    if (!clientInfo.address) errors.address = 'Address is required';
    if (!clientInfo.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(clientInfo.email)) errors.email = 'Email is invalid';
    if (!clientInfo.phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(clientInfo.phone)) errors.phone = 'Phone number must be 10 digits';
    if (clientInfo.country === 'India' && !clientInfo.pinCode) errors.pinCode = 'PIN code is required';
    
    setErrors(prev => ({ ...prev, clientInfo: errors }));
    return Object.keys(errors).length === 0;
  };

  // Validate invoice items
  const validateInvoiceItems = () => {
    if (invoiceItems.length === 0) {
      setErrors(prev => ({ ...prev, invoiceItems: [{ general: 'At least one invoice item is required' }] }));
      return false;
    }
    
    const itemErrors = invoiceItems.map(item => {
      const errors = {};
      if (!item.description) errors.description = 'Description is required';
      if (item.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
      if (item.price < 0) errors.price = 'Price cannot be negative';
      return errors;
    });
    
    const hasErrors = itemErrors.some(item => Object.keys(item).length > 0);
    setErrors(prev => ({ ...prev, invoiceItems: itemErrors }));
    return !hasErrors;
  };

  // Validate the entire invoice
  const validateInvoice = () => {
    const isCompanyValid = validateCompanyInfo();
    const isClientValid = validateClientInfo();
    const areItemsValid = validateInvoiceItems();
    
    return isCompanyValid && isClientValid && areItemsValid;
  };

  // Save to localStorage
  useEffect(() => {
    // Save company info to localStorage if it's valid
    if (companyInfo.name && companyInfo.email) {
      localStorage.setItem('invoxis_company_info', JSON.stringify(companyInfo));
    }
    
    // Save client info to localStorage if it's valid
    if (clientInfo.name && clientInfo.email) {
      // Store up to 5 recent clients
      const recentClients = JSON.parse(localStorage.getItem('invoxis_recent_clients') || '[]');
      const existingClientIndex = recentClients.findIndex(c => c.email === clientInfo.email);
      
      if (existingClientIndex >= 0) {
        // Update existing client
        recentClients[existingClientIndex] = clientInfo;
      } else {
        // Add new client, keep only the 5 most recent
        recentClients.unshift(clientInfo);
        if (recentClients.length > 5) recentClients.pop();
      }
      
      localStorage.setItem('invoxis_recent_clients', JSON.stringify(recentClients));
    }
  }, [companyInfo, clientInfo]);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('invoxis_company_info');
    if (savedCompanyInfo) {
      setCompanyInfo(JSON.parse(savedCompanyInfo));
    }
  }, []);

  // Get recent clients from localStorage
  const getRecentClients = () => {
    return JSON.parse(localStorage.getItem('invoxis_recent_clients') || '[]');
  };

  // Generate PDF
  const generatePdf = () => {
    const invoiceElement = document.getElementById('invoice-to-print');
    
    if (!invoiceElement) {
      alert('Invoice preview not found. Please switch to the Preview tab first.');
      return;
    }
    
    // Show loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.innerText = 'Generating PDF...';
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.padding = '20px';
    loadingMessage.style.background = 'rgba(0,0,0,0.8)';
    loadingMessage.style.color = 'white';
    loadingMessage.style.borderRadius = '10px';
    loadingMessage.style.zIndex = '9999';
    loadingMessage.style.fontFamily = 'Inter, sans-serif';
    loadingMessage.style.fontSize = '16px';
    loadingMessage.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    document.body.appendChild(loadingMessage);
    
    // Temporarily hide the preview actions for clean PDF
    const previewActions = invoiceElement.querySelector('.preview-actions');
    if (previewActions) {
      previewActions.style.display = 'none';
    }
    
    // Apply print styles to ensure single page
    const originalStyles = {
      fontSize: invoiceElement.style.fontSize,
      padding: invoiceElement.style.padding,
      margin: invoiceElement.style.margin
    };
    
    // Optimize for single page
    invoiceElement.style.fontSize = '12px';
    invoiceElement.style.padding = '10px';
    invoiceElement.style.margin = '0';
    
    // Use html2canvas to capture the invoice as an image
    html2canvas(invoiceElement, {
      scale: 2, // Balanced scale for quality and size
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800, // Fixed width for consistent sizing
      height: 1000, // Fixed height to fit A4
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      // Restore original styles
      invoiceElement.style.fontSize = originalStyles.fontSize;
      invoiceElement.style.padding = originalStyles.padding;
      invoiceElement.style.margin = originalStyles.margin;
      
      // Remove loading message
      document.body.removeChild(loadingMessage);
      
      // Restore preview actions
      if (previewActions) {
        previewActions.style.display = 'flex';
      }
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5; // Smaller margins for more content
      
      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ensure it fits on single page
      const maxHeight = pageHeight - (margin * 2);
      const finalHeight = Math.min(imgHeight, maxHeight);
      const finalWidth = (canvas.width * finalHeight) / canvas.height;
      
      // Center the image on the page
      const xPosition = margin + (imgWidth - finalWidth) / 2;
      const yPosition = margin;
      
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', xPosition, yPosition, finalWidth, finalHeight);
      
      // Generate a filename with current date and invoice number
      const date = new Date();
      const invoiceNumber = generateInvoiceNumber();
      const filename = `Invoice_${invoiceNumber}_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.pdf`;
      
      // Save the PDF
      pdf.save(filename);
    }).catch(error => {
      // Restore original styles
      invoiceElement.style.fontSize = originalStyles.fontSize;
      invoiceElement.style.padding = originalStyles.padding;
      invoiceElement.style.margin = originalStyles.margin;
      
      // Remove loading message
      if (document.body.contains(loadingMessage)) {
        document.body.removeChild(loadingMessage);
      }
      
      // Restore preview actions
      if (previewActions) {
        previewActions.style.display = 'flex';
      }
      
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    });
  };

  // Validate all form fields
  const validateAll = () => {
    return validateCompanyInfo() && validateClientInfo() && validateInvoiceItems();
  };

  // Context value
  const value = {
    companyInfo,
    setCompanyInfo,
    clientInfo,
    setClientInfo,
    invoiceItems,
    setInvoiceItems,
    settings,
    updateSettings,
    errors,
    totals,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    validateCompanyInfo,
    validateClientInfo,
    validateInvoiceItems,
    validateAll,
    getRecentClients,
    calculateSubtotal,
    calculateTax,
    calculateDiscount,
    calculateTotal,
    generatePdf,
    handleLogoUpload,
    removeLogo
  };


  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Custom hook to use the invoice context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};