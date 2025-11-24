import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  TextField,
  TableSortLabel,
  Box
} from '@mui/material';

function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Haettu harjoitusdata:', data);
        
        const trainingsWithCustomers = data._embedded.trainings.map(training => {
          if (training._links.customer) {
            return fetch(training._links.customer.href)
              .then(res => res.json())
              .then(customer => ({
                ...training,
                customer: customer
              }));
          }
          return Promise.resolve({ ...training, customer: null });
        });

        Promise.all(trainingsWithCustomers)
          .then(results => {
            setTrainings(results);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Virhe haettaessa harjoituksia:', error);
        setLoading(false);
      });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const getCustomerName = (training) => {
    if (training.customer) {
      return `${training.customer.firstname} ${training.customer.lastname}`;
    }
    return 'N/A';
  };

  const sortedAndFilteredTrainings = () => {
    let filtered = trainings.filter(training => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      const activity = training.activity?.toLowerCase() || '';
      const customerName = getCustomerName(training).toLowerCase();
      const duration = training.duration?.toString() || '';
      const date = training.date ? dayjs(training.date).format('DD.MM.YYYY HH:mm') : '';

      return (
        activity.includes(search) ||
        customerName.includes(search) ||
        duration.includes(search) ||
        date.includes(search)
      );
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;

      switch(orderBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'activity':
          aValue = a.activity?.toLowerCase() || '';
          bValue = b.activity?.toLowerCase() || '';
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case 'customerName':
          aValue = getCustomerName(a).toLowerCase();
          bValue = getCustomerName(b).toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Harjoitukset
        </Typography>
        <TextField
          label="Etsi harjoituksia"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Etsi aktiviteetilla, asiakkaalla, päivämäärällä..."
          sx={{ width: '450px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Päivämäärä
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                <TableSortLabel
                  active={orderBy === 'activity'}
                  direction={orderBy === 'activity' ? order : 'asc'}
                  onClick={() => handleRequestSort('activity')}
                >
                  Aktiviteetti
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === 'duration'}
                  direction={orderBy === 'duration' ? order : 'asc'}
                  onClick={() => handleRequestSort('duration')}
                >
                  Kesto (min)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>
                <TableSortLabel
                  active={orderBy === 'customerName'}
                  direction={orderBy === 'customerName' ? order : 'asc'}
                  onClick={() => handleRequestSort('customerName')}
                >
                  Asiakas
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredTrainings().map((training, index) => (
              <TableRow key={index}>
                <TableCell>
                  {training.date ? dayjs(training.date).format('DD.MM.YYYY HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>{training.activity || 'N/A'}</TableCell>
                <TableCell>{training.duration || 'N/A'}</TableCell>
                <TableCell>{getCustomerName(training)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Trainings;
