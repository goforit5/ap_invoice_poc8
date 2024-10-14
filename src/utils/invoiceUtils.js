import invoicesData from '../data/invoices.json';

export const getInvoiceById = (id) => {
  return invoicesData.find(invoice => invoice.id === id);
};
