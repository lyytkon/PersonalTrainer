import { useState, useEffect } from 'react';
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

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('lastname');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Haettu data:', data); 
        
        setCustomers(data._embedded.customers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Virhe haettaessa asiakkaita:', error);
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

  const sortedAndFilteredCustomers = () => {
    let filtered = customers.filter(customer => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      const firstname = customer.firstname?.toLowerCase() || '';
      const lastname = customer.lastname?.toLowerCase() || '';
      const email = customer.email?.toLowerCase() || '';
      const phone = customer.phone?.toLowerCase() || '';
      const streetaddress = customer.streetaddress?.toLowerCase() || '';
      const postcode = customer.postcode?.toLowerCase() || '';
      const city = customer.city?.toLowerCase() || '';

      return (
        firstname.includes(search) ||
        lastname.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        streetaddress.includes(search) ||
        postcode.includes(search) ||
        city.includes(search)
      );
    });

    return filtered.sort((a, b) => {
      const aValue = a[orderBy]?.toLowerCase() || '';
      const bValue = b[orderBy]?.toLowerCase() || '';

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
          Asiakkaat
        </Typography>
        <TextField
          label="Etsi asiakkaita"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Etsi nimellä, sähköpostilla, puhelimella..."
          sx={{ width: '400px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'firstname'}
                  direction={orderBy === 'firstname' ? order : 'asc'}
                  onClick={() => handleRequestSort('firstname')}
                >
                  Etunimi
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'lastname'}
                  direction={orderBy === 'lastname' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastname')}
                >
                  Sukunimi
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  S-posti
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'phone'}
                  direction={orderBy === 'phone' ? order : 'asc'}
                  onClick={() => handleRequestSort('phone')}
                >
                  Puhelin
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'streetaddress'}
                  direction={orderBy === 'streetaddress' ? order : 'asc'}
                  onClick={() => handleRequestSort('streetaddress')}
                >
                  Osoite
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'postcode'}
                  direction={orderBy === 'postcode' ? order : 'asc'}
                  onClick={() => handleRequestSort('postcode')}
                >
                  Postinumero
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'city'}
                  direction={orderBy === 'city' ? order : 'asc'}
                  onClick={() => handleRequestSort('city')}
                >
                  Kaupunki
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredCustomers().map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.firstname}</TableCell>
                <TableCell>{customer.lastname}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.streetaddress}</TableCell>
                <TableCell>{customer.postcode}</TableCell>
                <TableCell>{customer.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Customers;