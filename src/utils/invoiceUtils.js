import invoicesData from '../data/invoices.json';

export const getInvoiceById = (id) => {
  console.log('Searching for invoice with id:', id);
  console.log('Available invoices:', invoicesData);
  const invoice = invoicesData.find(invoice => invoice.id === id);
  console.log('Found invoice:', invoice);
  return invoice;
};
