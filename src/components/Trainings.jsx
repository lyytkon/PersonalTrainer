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
  const [filters, setFilters] = useState({
    activity: '',
    customerName: '',
    duration: '',
    date: ''
  });

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
        
        // Haetaan asiakastiedot jokaiselle harjoitukselle
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCustomerName = (training) => {
    if (training.customer) {
      return `${training.customer.firstname} ${training.customer.lastname}`;
    }
    return 'N/A';
  };

  const sortedAndFilteredTrainings = () => {
    let filtered = trainings.filter(training => {
      const activity = training.activity?.toLowerCase() || '';
      const customerName = getCustomerName(training).toLowerCase();
      const duration = training.duration?.toString() || '';
      const date = training.date ? dayjs(training.date).format('DD.MM.YYYY HH:mm') : '';

      return (
        activity.includes(filters.activity.toLowerCase()) &&
        customerName.includes(filters.customerName.toLowerCase()) &&
        duration.includes(filters.duration) &&
        date.includes(filters.date)
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
      <Typography variant="h4" gutterBottom>
        Harjoitukset
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Päivämäärä
                </TableSortLabel>
                <TextField
                  size="small"
                  placeholder="Suodata..."
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'activity'}
                  direction={orderBy === 'activity' ? order : 'asc'}
                  onClick={() => handleRequestSort('activity')}
                >
                  Aktiviteetti
                </TableSortLabel>
                <TextField
                  size="small"
                  placeholder="Suodata..."
                  value={filters.activity}
                  onChange={(e) => handleFilterChange('activity', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'duration'}
                  direction={orderBy === 'duration' ? order : 'asc'}
                  onClick={() => handleRequestSort('duration')}
                >
                  Kesto (min)
                </TableSortLabel>
                <TextField
                  size="small"
                  placeholder="Suodata..."
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customerName'}
                  direction={orderBy === 'customerName' ? order : 'asc'}
                  onClick={() => handleRequestSort('customerName')}
                >
                  Asiakas
                </TableSortLabel>
                <TextField
                  size="small"
                  placeholder="Suodata..."
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  sx={{ mt: 1 }}
                />
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
