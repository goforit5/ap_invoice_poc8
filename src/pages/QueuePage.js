import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-001', facility: 'General Hospital', supplierName: 'Registry Nursing Services', invDate: '2024-10-01', invNumber: 'RNS-2024-001', invAmount: 5000, status: 'Awaiting Review', aiConfidence: 0.92 },
  { id: 'INV-002', facility: 'City Medical Center', supplierName: 'Office Supplies Inc', invDate: '2024-10-02', invNumber: 'OSI-2024-002', invAmount: 1500, status: 'Needs Attention', aiConfidence: 0.78 },
  { id: 'INV-003', facility: 'County Hospital', supplierName: 'Medical Equipment Co', invDate: '2024-10-03', invNumber: 'MEC-2024-003', invAmount: 3000, status: 'Processed', aiConfidence: 0.98 },
  { id: 'INV-004', facility: 'Private Clinic', supplierName: 'Tech Hardware Ltd', invDate: '2024-10-04', invNumber: 'THL-2024-004', invAmount: 7500, status: 'Awaiting Review', aiConfidence: 0.88 },
  { id: 'INV-005', facility: 'Urgent Care Center', supplierName: 'Pharmacy Supplies', invDate: '2024-10-05', invNumber: 'PS-2024-005', invAmount: 2000, status: 'Needs Attention', aiConfidence: 0.72 }
];

const QueuePage = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [detailedView, setDetailedView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'd') {
      setDetailedView(prev => !prev);
    } else if (event.key === '/') {
      event.preventDefault();
      document.getElementById('searchInput').focus();
    } else if (event.key === 'Enter' && filteredInvoices.length > 0) {
      alert(`Opening invoice: ${filteredInvoices[0].id}`);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Awaiting Review': return 'bg-blue-100 text-blue-800';
      case 'Needs Attention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderActionButton = (invoice) => {
    if (invoice.status === 'Processed') {
      return (
        <button className="w-full px-2 py-1 text-xs bg-gray-500 text-white rounded">
          View Details
        </button>
      );
    }
    
    if (invoice.aiConfidence > 0.9) {
      return (
        <div className="flex gap-1">
          <button className="flex-1 px-2 py-1 text-xs bg-green-500 text-white rounded">
            Quick Approve
          </button>
          <button className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded">
            Review
          </button>
        </div>
      );
    }
    
    return (
      <button className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded">
        Review
      </button>
    );
  };

  const filteredInvoices = invoices.filter(invoice =>
    Object.values(invoice).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Invoice Queue</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              id="searchInput"
              type="text"
              placeholder="Search invoices..."
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inv Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inv Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inv Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {detailedView && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Confidence</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="cursor-pointer hover:bg-gray-50" onClick={() => alert(`Opening invoice: ${invoice.id}`)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.facility}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.invAmount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                {detailedView && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className={`h-2 rounded-full ${getConfidenceColor(invoice.aiConfidence)}`} style={{ width: `${invoice.aiConfidence * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{(invoice.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderActionButton(invoice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueuePage;
