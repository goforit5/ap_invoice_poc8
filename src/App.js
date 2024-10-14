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
