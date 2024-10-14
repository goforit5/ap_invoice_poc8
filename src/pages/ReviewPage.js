import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';
import { getInvoiceById } from '../utils/invoiceUtils';

const ReviewPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  const [detailedView, setDetailedView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [error, setError] = useState(null);

  console.log('ReviewPage rendered. Current route:', location.pathname);
  console.log('Invoice ID from params:', id);

  const handleKeyDown = useCallback((event) => {
    console.log('Key pressed:', event.key);
    if (document.activeElement.id !== 'searchInput') {
      if (event.key === 'd') {
        setDetailedView(prev => !prev);
        console.log('Detailed view toggled:', !detailedView);
      } else if (event.key === '/') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
        console.log('Search input focused');
      } else if (event.key === 'a') {
        console.log('Invoice approved');
        alert('Invoice approved');
      } else if (event.key === 'r') {
        console.log('Invoice rejected');
        alert('Invoice rejected');
      } else if (event.key === '+' || event.key === '=') {
        setZoomLevel(prev => Math.min(prev + 10, 200));
        console.log('Zoom level increased:', Math.min(zoomLevel + 10, 200));
      } else if (event.key === '-') {
        setZoomLevel(prev => Math.max(prev - 10, 50));
        console.log('Zoom level decreased:', Math.max(zoomLevel - 10, 50));
      }
    }
  }, [detailedView, zoomLevel]);

  useEffect(() => {
    console.log('Fetching invoice with ID:', id);
    const fetchedInvoice = getInvoiceById(id);
    console.log('Fetched invoice:', fetchedInvoice);
    if (fetchedInvoice) {
      setInvoice(fetchedInvoice);
      console.log('Invoice set in state:', fetchedInvoice);
    } else {
      const errorMessage = `Invoice with ID ${id} not found`;
      console.error(errorMessage);
      setError(errorMessage);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      console.log('Cleanup: removed keydown event listener');
    };
  }, [id, handleKeyDown]);

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

  if (error) {
    return <div className="bg-white shadow rounded-lg p-6">Error: {error}</div>;
  }

  if (!invoice) {
    return <div className="bg-white shadow rounded-lg p-6">Loading...</div>;
  }

  console.log('Rendering invoice:', invoice); // Debug log

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Invoice Review - {invoice.id}</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => alert('Invoice approved')}>Approve (A)</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => alert('Invoice rejected')}>Reject (R)</button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
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
            {detailedView ? 'Hide' : 'Show'} Details (D)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Preview</h3>
            <div className="relative h-96 bg-white flex items-center justify-center border">
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

        <div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
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

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Line Items</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
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
                <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
  );
};

export default ReviewPage;
