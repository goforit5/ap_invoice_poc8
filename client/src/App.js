import React from 'react';
import InvoiceReview from './components/InvoiceReview';

function App() {
  return (
    <div className="App">
      <InvoiceReview 
        onApprove={() => console.log('Invoice approved')}
        onReject={() => console.log('Invoice rejected')}
        onNextInvoice={() => console.log('Next invoice')}
      />
    </div>
  );
}

export default App;
