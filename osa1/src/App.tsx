import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Customers from './components/Customers';
import Trainings from './components/Trainings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/trainings" element={<Trainings />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App
