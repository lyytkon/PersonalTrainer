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
  TextField,
  TableSortLabel,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';
import { Customer, CustomersResponse, SnackbarState, SortOrder } from '../types';

type CustomerSortKey = 'firstname' | 'lastname' | 'email' | 'phone' | 'streetaddress' | 'postcode' | 'city';

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<CustomerSortKey>('lastname');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

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
      .then((data: CustomersResponse) => {
        console.log('Haettu data:', data); 
        
        setCustomers(data._embedded.customers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Virhe haettaessa asiakkaita:', error);
        setLoading(false);
      });
  };

  const handleRequestSort = (property: CustomerSortKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCustomerAdded = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({
      open: true,
      message: message,
      severity: severity
    });
    fetchCustomers();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const deleteCustomer = (customer: Customer) => {
    if (window.confirm(`Haluatko varmasti poistaa asiakkaan ${customer.firstname} ${customer.lastname}?`)) {
      fetch(customer._links.self.href, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Asiakkaan poisto epäonnistui');
          }
          handleCustomerAdded('Asiakas poistettu onnistuneesti!', 'success');
        })
        .catch(error => {
          console.error('Virhe:', error);
          handleCustomerAdded('Virhe asiakkaan poistossa', 'error');
        });
    }
  };

  const exportToCSV = () => {
    const csvData = customers.map(customer => ({
      Etunimi: customer.firstname,
      Sukunimi: customer.lastname,
      Sähköposti: customer.email,
      Puhelin: customer.phone,
      Osoite: customer.streetaddress,
      Postinumero: customer.postcode,
      Kaupunki: customer.city
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'asiakkaat.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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


  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Asiakkaat
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Etsi asiakkaita"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Etsi nimellä, sähköpostilla, puhelimella..."
            sx={{ width: '400px' }}
          />
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Vie CSV
          </Button>
          <AddCustomer onCustomerAdded={handleCustomerAdded} />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                <TableSortLabel
                  active={orderBy === 'firstname'}
                  direction={orderBy === 'firstname' ? order : 'asc'}
                  onClick={() => handleRequestSort('firstname')}
                >
                  Etunimi
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                <TableSortLabel
                  active={orderBy === 'lastname'}
                  direction={orderBy === 'lastname' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastname')}
                >
                  Sukunimi
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  S-posti
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                <TableSortLabel
                  active={orderBy === 'phone'}
                  direction={orderBy === 'phone' ? order : 'asc'}
                  onClick={() => handleRequestSort('phone')}
                >
                  Puhelin
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>
                <TableSortLabel
                  active={orderBy === 'streetaddress'}
                  direction={orderBy === 'streetaddress' ? order : 'asc'}
                  onClick={() => handleRequestSort('streetaddress')}
                >
                  Osoite
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === 'postcode'}
                  direction={orderBy === 'postcode' ? order : 'asc'}
                  onClick={() => handleRequestSort('postcode')}
                >
                  Postinumero
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                <TableSortLabel
                  active={orderBy === 'city'}
                  direction={orderBy === 'city' ? order : 'asc'}
                  onClick={() => handleRequestSort('city')}
                >
                  Kaupunki
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                Toiminnot
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
                <TableCell>
                  <EditCustomer 
                    customer={customer} 
                    onCustomerUpdated={handleCustomerAdded}
                  />
                  <IconButton 
                    onClick={() => deleteCustomer(customer)} 
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Customers;
