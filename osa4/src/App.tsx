import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Customers from './components/Customers';
import Trainings from './components/Trainings';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
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
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
