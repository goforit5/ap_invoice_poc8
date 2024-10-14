import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import QueuePage from './pages/QueuePage';
import ReviewPage from './pages/ReviewPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/queue" replace />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AP Invoice Processing</h1>
        <p>Welcome to the AP Invoice Processing application.</p>
      </header>
    </div>
  );
}

export default App;
