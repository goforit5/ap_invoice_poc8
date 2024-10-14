import React, { useState, useEffect, useCallback } from 'react';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

const mockInvoice = {
  id: 'INV-001',
  supplierName: 'Registry Nursing Services',
  facility: 'General Hospital',
  invNumber: 'RNS-2024-001',
  invDate: '2024-10-01',
  invAmount: 5000,
  status: 'Awaiting Review',
  aiConfidence: 0.92,
  details: {
    supplierName: { value: 'Registry Nursing Services', confidence: 0.98 },
    facility: { value: 'General Hospital', confidence: 0.99 },
    invNumber: { value: 'RNS-2024-001', confidence: 0.97 },
    invDate: { value: '2024-10-01', confidence: 0.95 },
    invAmount: { value: 5000, confidence: 0.96 },
  },
  lineItems: [
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'RN-001', amount: 1600, description: 'Registered Nurse - 16 hours', quantity: 16, unitPrice: 100, confidence: 0.94 },
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'RN-002', amount: 1600, description: 'Registered Nurse - 16 hours', quantity: 16, unitPrice: 100, confidence: 0.93 },
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'LVN-001', amount: 960, description: 'Licensed Vocational Nurse - 16 hours', quantity: 16, unitPrice: 60, confidence: 0.92 },
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'LVN-002', amount: 960, description: 'Licensed Vocational Nurse - 16 hours', quantity: 16, unitPrice: 60, confidence: 0.91 },
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'CNA-001', amount: 440, description: 'Certified Nursing Assistant - 16 hours', quantity: 16, unitPrice: 27.5, confidence: 0.90 },
    { costCategory: 'Nursing', spendCategory: 'Temporary Staff', jobCode: 'CNA-002', amount: 440, description: 'Certified Nursing Assistant - 16 hours', quantity: 16, unitPrice: 27.5, confidence: 0.89 },
  ]
};

const InvoiceReview = ({ onApprove, onReject, onNextInvoice }) => {
  const [invoice, setInvoice] = useState(mockInvoice);
  const [detailedView, setDetailedView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'd') {
      setDetailedView(prev => !prev);
    } else if (event.key === '/') {
      event.preventDefault();
      document.getElementById('searchInput').focus();
    } else if (event.key === 'a') {
      onApprove && onApprove(invoice);
      onNextInvoice && onNextInvoice();
    } else if (event.key === 'r') {
      onReject && onReject(invoice);
      onNextInvoice && onNextInvoice();
    }
  }, [invoice, onApprove, onReject, onNextInvoice]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <span key={index} className="bg-yellow-200">{part}</span>
        : part
    );
  };

  const ConfidenceBar = ({ confidence }) => (
    <div className="flex items-center">
      <div className="w-16 bg-gray-200 rounded-full h-2 mr-1">
        <div className={`h-2 rounded-full ${getConfidenceColor(confidence)}`} style={{ width: `${confidence * 100}%` }}></div>
      </div>
      <span className="text-xs">{(confidence * 100).toFixed(0)}%</span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">AP Invoice Processing</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onApprove && onApprove(invoice)}>Approve</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => onReject && onReject(invoice)}>Reject</button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">REVIEW</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              id="searchInput"
              type="text"
              placeholder="Search invoice..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button 
            onClick={() => setDetailedView(!detailedView)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            {detailedView ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-6">
          <div className="w-1/2">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Preview</h3>
              <div className="relative h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">PDF Viewer Placeholder</p>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button onClick={() => setZoomLevel(prev => Math.min(prev + 10, 200))} className="p-2 bg-white rounded-full shadow">
                    <ZoomIn size={20} />
                  </button>
                  <button onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))} className="p-2 bg-white rounded-full shadow">
                    <ZoomOut size={20} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Zoom: {zoomLevel}%</p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(invoice.details).map(([key, { value, confidence }]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-500">{key}</p>
                    <p className="text-sm text-gray-900">{highlightSearchTerm(value)}</p>
                    {detailedView && <ConfidenceBar confidence={confidence} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Line Items</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Cost/Spend/Job Code</th>
                <th className="px-4 py-2 text-right">Amount</th>
                {detailedView && (
                  <>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-center">Confidence</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-2">
                      {highlightSearchTerm(`${item.costCategory}/${item.spendCategory}/${item.jobCode}`)}
                    </td>
                    <td className="px-4 py-2 text-right">${item.amount.toLocaleString()}</td>
                    {detailedView && (
                      <>
                        <td className="px-4 py-2">{highlightSearchTerm(item.description)}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <ConfidenceBar confidence={item.confidence} />
                        </td>
                      </>
                    )}
                  </tr>
                  {detailedView && (
                    <tr className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td colSpan="6" className="px-4 py-2">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Cost Category:</span> {highlightSearchTerm(item.costCategory)}
                          </div>
                          <div>
                            <span className="font-medium">Spend Category:</span> {highlightSearchTerm(item.spendCategory)}
                          </div>
                          <div>
                            <span className="font-medium">Job Code:</span> {highlightSearchTerm(item.jobCode)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReview;
