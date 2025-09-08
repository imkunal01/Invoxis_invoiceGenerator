import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

// Create context for the invoice data
const InvoiceContext = createContext();

/**
 * A custom hook to access the invoice context
 */
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

/**
 * InvoiceProvider component that manages the global state for the invoice.
 * It handles company info, client info, invoice items, and calculations.
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
    taxRate: 18,
    discountType: 'percentage',
    discount: 0,
    currency: 'INR',
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
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
    return validateCompanyInfo() && validateClientInfo() && validateInvoiceItems();
  };

  // Save to localStorage
  useEffect(() => {
    if (companyInfo.name && companyInfo.email) {
      localStorage.setItem('invoxis_company_info', JSON.stringify(companyInfo));
    }
    if (clientInfo.name && clientInfo.email) {
      const recentClients = JSON.parse(localStorage.getItem('invoxis_recent_clients') || '[]');
      const existingClientIndex = recentClients.findIndex(c => c.email === clientInfo.email);
      if (existingClientIndex >= 0) {
        recentClients[existingClientIndex] = clientInfo;
      } else {
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

  // Generate PDF - Updated to ensure single-page, scaled output
  const generatePdf = () => {
    const invoiceElement = document.getElementById('invoice-to-print');
    if (!invoiceElement) {
      console.error('Invoice preview element not found. Please ensure it has the id "invoice-to-print".');
      return;
    }

    // Replace alert with a temporary message
    const messageContainer = document.createElement('div');
    messageContainer.className = "fixed inset-0 flex items-center justify-center z-[9999]";
    messageContainer.innerHTML = `
      <div class="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div class="text-white text-lg font-semibold animate-pulse">Generating PDF...</div>
        <div class="text-gray-400 text-sm mt-2">This may take a moment.</div>
      </div>
    `;
    document.body.appendChild(messageContainer);

    // Temporarily hide actions for a clean screenshot
    const previewActions = invoiceElement.querySelector('.preview-actions');
    if (previewActions) {
      previewActions.style.display = 'none';
    }

    // Use html2canvas to capture the entire element without fixed dimensions
    html2canvas(invoiceElement, {
      scale: 3, // Increased scale for better resolution
      useCORS: true,
      logging: false,
      allowTaint: true,
    }).then(canvas => {
      // Remove the loading message
      document.body.removeChild(messageContainer);

      // Restore preview actions
      if (previewActions) {
        previewActions.style.display = 'flex';
      }

      // Create PDF with A4 dimensions in millimeters
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the image dimensions to fit on a single page while maintaining aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Check if the image height exceeds the page height and scale down if needed
      let finalImgHeight = imgHeight;
      let finalImgWidth = imgWidth;
      if (imgHeight > pdfHeight) {
        finalImgHeight = pdfHeight;
        finalImgWidth = (imgProps.width * pdfHeight) / imgProps.height;
      }

      // Center the image horizontally on the page
      const xPosition = (pdfWidth - finalImgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xPosition, 0, finalImgWidth, finalImgHeight);

      // Generate a filename
      const date = new Date();
      const invoiceNumber = generateInvoiceNumber();
      const filename = `Invoice_${invoiceNumber}_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.pdf`;
      
      pdf.save(filename);
    }).catch(error => {
      // Remove loading message if it's still there
      if (document.body.contains(messageContainer)) {
        document.body.removeChild(messageContainer);
      }
      
      // Restore preview actions
      if (previewActions) {
        previewActions.style.display = 'flex';
      }
      
      console.error('Error generating PDF:', error);
      
      // Display error message to user
      const errorMessageContainer = document.createElement('div');
      errorMessageContainer.className = "fixed inset-0 flex items-center justify-center z-[9999]";
      errorMessageContainer.innerHTML = `
        <div class="bg-red-900 bg-opacity-80 p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div class="text-white text-lg font-semibold">Error Generating PDF</div>
          <div class="text-red-300 text-sm mt-2">Please try again.</div>
        </div>
      `;
      document.body.appendChild(errorMessageContainer);
      setTimeout(() => document.body.removeChild(errorMessageContainer), 3000); // Hide after 3 seconds
    });
  };

  // Validate all form fields
  const validateAll = () => {
    return validateCompanyInfo() && validateClientInfo() && validateInvoiceItems();
  };

  // Context value
  const value = {
    companyInfo, setCompanyInfo,
    clientInfo, setClientInfo,
    invoiceItems, setInvoiceItems,
    settings, updateSettings,
    errors,
    totals,
    addInvoiceItem, updateInvoiceItem, removeInvoiceItem,
    validateCompanyInfo, validateClientInfo, validateInvoiceItems, validateAll,
    getRecentClients,
    calculateSubtotal, calculateTax, calculateDiscount, calculateTotal,
    generatePdf, handleLogoUpload, removeLogo
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Main App component that uses the provider and renders the UI
const App = () => {
  const [activeTab, setActiveTab] = useState('editor');
  
  // Create a form component
  const InvoiceForm = () => {
    const { companyInfo, setCompanyInfo, clientInfo, setClientInfo, invoiceItems, updateInvoiceItem, removeInvoiceItem, addInvoiceItem, settings, updateSettings, errors } = useInvoice();

    const handleCompanyChange = (e) => {
      const { name, value } = e.target;
      setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleClientChange = (e) => {
      const { name, value } = e.target;
      setClientInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSettingsChange = (e) => {
      const { name, value } = e.target;
      updateSettings(name, value);
    };

    const handleItemChange = (id, e) => {
      const { name, value, type, checked } = e.target;
      updateInvoiceItem(id, name, type === 'checkbox' ? checked : value);
    };
    
    return (
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        {/* Company Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Company Name</label>
              <input type="text" name="name" value={companyInfo.name} onChange={handleCompanyChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              {errors.companyInfo.name && <p className="mt-1 text-sm text-red-600">{errors.companyInfo.name}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input type="email" name="email" value={companyInfo.email} onChange={handleCompanyChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              {errors.companyInfo.email && <p className="mt-1 text-sm text-red-600">{errors.companyInfo.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium">Address</label>
              <textarea name="address" value={companyInfo.address} onChange={handleCompanyChange} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"></textarea>
              {errors.companyInfo.address && <p className="mt-1 text-sm text-red-600">{errors.companyInfo.address}</p>}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Client Name</label>
              <input type="text" name="name" value={clientInfo.name} onChange={handleClientChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              {errors.clientInfo.name && <p className="mt-1 text-sm text-red-600">{errors.clientInfo.name}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input type="email" name="email" value={clientInfo.email} onChange={handleClientChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              {errors.clientInfo.email && <p className="mt-1 text-sm text-red-600">{errors.clientInfo.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium">Address</label>
              <textarea name="address" value={clientInfo.address} onChange={handleClientChange} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"></textarea>
              {errors.clientInfo.address && <p className="mt-1 text-sm text-red-600">{errors.clientInfo.address}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice Items</h2>
          {invoiceItems.length === 0 && (
            <div className="text-center text-gray-500 italic mb-4">No items added yet.</div>
          )}
          {invoiceItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border-b border-gray-200 last:border-b-0">
              <div className="sm:col-span-4">
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea name="description" value={item.description} onChange={(e) => handleItemChange(item.id, e)} rows="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"></textarea>
                {errors.invoiceItems[index]?.description && <p className="mt-1 text-sm text-red-600">{errors.invoiceItems[index].description}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Quantity</label>
                <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" min="1" />
                {errors.invoiceItems[index]?.quantity && <p className="mt-1 text-sm text-red-600">{errors.invoiceItems[index].quantity}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Price</label>
                <input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" min="0" />
                {errors.invoiceItems[index]?.price && <p className="mt-1 text-sm text-red-600">{errors.invoiceItems[index].price}</p>}
              </div>
              <div className="sm:col-span-2 flex items-center justify-end">
                <button type="button" onClick={() => removeInvoiceItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <button type="button" onClick={addInvoiceItem} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200">Add Item</button>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Invoice Number</label>
              <input type="text" name="invoiceNumber" value={settings.invoiceNumber} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Invoice Date</label>
              <input type="date" name="invoiceDate" value={settings.invoiceDate} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Due Date</label>
              <input type="date" name="dueDate" value={settings.dueDate} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Tax Rate (%)</label>
              <input type="number" name="taxRate" value={settings.taxRate} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" min="0" max="100" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Create an invoice preview component
  const InvoicePreview = () => {
    const { companyInfo, clientInfo, invoiceItems, totals, settings, generatePdf, validateAll } = useInvoice();

    const handleGeneratePdf = () => {
      if (validateAll()) {
        generatePdf();
      } else {
        alert('Please fix the validation errors before generating the PDF.');
      }
    };
    
    return (
      <div id="invoice-to-print" className="bg-gray-100 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:border-0 print:rounded-none">
          
          {/* Action buttons visible only in the preview, not in the PDF */}
          <div className="preview-actions flex justify-end p-4 bg-gray-50 border-b border-gray-200 space-x-2">
            <button onClick={handleGeneratePdf} className="flex items-center space-x-2 bg-purple-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.707-8.707a1 1 0 000 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L13 11.586V4a1 1 0 10-2 0v7.586l-2.293-2.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
          
          {/* Main Invoice Content */}
          <div className="p-10 font-sans">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-5xl font-extrabold text-gray-800">INVOICE</h1>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-700">{companyInfo.name || 'Your Company Name'}</p>
                <p className="text-sm text-gray-500">{companyInfo.address || 'Your Company Address'}</p>
              </div>
            </div>
            
            <div className="flex justify-between mb-12">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-2">Invoice To:</h3>
                <p className="font-medium text-gray-800">{clientInfo.name || 'Client Name'}</p>
                <p className="text-sm text-gray-500">{clientInfo.address || 'Client Address'}</p>
                <p className="text-sm text-gray-500">{clientInfo.email || 'client@example.com'}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-2">Details:</h3>
                <p className="text-sm text-gray-700">Invoice #: <span className="font-medium">{settings.invoiceNumber}</span></p>
                <p className="text-sm text-gray-700">Date: <span className="font-medium">{settings.invoiceDate}</span></p>
                <p className="text-sm text-gray-700">Due Date: <span className="font-medium">{settings.dueDate}</span></p>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-left text-sm bg-white">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 uppercase tracking-wider font-semibold">
                    <th scope="col" className="px-6 py-3">Description</th>
                    <th scope="col" className="px-6 py-3 text-right">Qty</th>
                    <th scope="col" className="px-6 py-3 text-right">Price</th>
                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceItems.length > 0 ? invoiceItems.map(item => (
                    <tr key={item.id} className="text-gray-800">
                      <td className="px-6 py-4">{item.description || 'Item Description'}</td>
                      <td className="px-6 py-4 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{settings.currency} {Number(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">{settings.currency} {(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr className="text-gray-500 italic">
                      <td colSpan="4" className="px-6 py-4 text-center">No invoice items added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-8">
              <div className="w-full max-w-sm space-y-2 text-right">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span>{settings.currency} {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Tax ({settings.taxRate}%):</span>
                  <span>{settings.currency} {totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Discount:</span>
                  <span>- {settings.currency} {totals.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 border-t-2 pt-2 border-gray-300">
                  <span>Total:</span>
                  <span>{settings.currency} {totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center text-gray-500 text-sm">
              <p>Thank you for your business. Please make payments within {settings.dueDate} to avoid late fees.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-200 min-h-screen font-sans antialiased text-gray-800">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left pane for form input */}
        <div className="w-full md:w-1/2 p-4 bg-gray-50 shadow-lg md:overflow-y-auto">
          <div className="flex justify-center md:justify-start items-center space-x-4 mb-6 sticky top-0 bg-gray-50 z-10 py-4">
            <h1 className="text-3xl font-extrabold text-blue-800">Invoxis</h1>
            <div className="flex space-x-2">
              <button onClick={() => setActiveTab('editor')} className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Editor
              </button>
              <button onClick={() => setActiveTab('preview')} className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Preview
              </button>
            </div>
          </div>
          <InvoiceProvider>
            {activeTab === 'editor' && <InvoiceForm />}
          </InvoiceProvider>
        </div>
        
        {/* Right pane for invoice preview */}
        <div className="w-full md:w-1/2 p-4 bg-gray-100 flex-1 md:overflow-y-auto">
          <InvoiceProvider>
            <InvoicePreview />
          </InvoiceProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
