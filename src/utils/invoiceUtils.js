import invoicesData from '../data/invoices.json?v=' + new Date().getTime();

export const getInvoiceById = (id) => {
  console.log('Searching for invoice with id:', id);
  console.log('Available invoices:', invoicesData);
  console.log('Invoice IDs:', invoicesData.map(inv => inv.id));
  const invoice = invoicesData.find(invoice => invoice.id === id);
  if (invoice) {
    console.log('Found invoice:', invoice);
  } else {
    console.error('Invoice not found for id:', id);
  }
  return invoice;
};
