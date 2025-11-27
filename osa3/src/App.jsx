import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Customers from './components/Customers';
import Trainings from './components/Trainings';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navigation />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Box sx={{ width: '100%', maxWidth: '1350px', px: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App
