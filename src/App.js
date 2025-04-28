import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EncodeForm from './components/EncodeForm';
import DecodeForm from './components/DecodeForm';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<EncodeForm />} />
          <Route path="/decode" element={<DecodeForm />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
