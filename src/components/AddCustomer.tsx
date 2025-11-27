import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddCustomerProps {
  onCustomerAdded: (message: string, severity?: 'success' | 'error') => void;
}

interface CustomerFormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
}

function AddCustomer({ onCustomerAdded }: AddCustomerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      streetaddress: '',
      postcode: '',
      city: ''
    });
  };

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Virhe tallennuksessa');
        }
        return response.json();
      })
      .then(() => {
        handleClose();
        onCustomerAdded('Asiakas lisätty onnistuneesti!');
      })
      .catch(error => {
        console.error('Virhe tallennettaessa asiakasta:', error);
        onCustomerAdded('Virhe tallennettaessa asiakasta', 'error');
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Lisää asiakas
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lisää uusi asiakas</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Etunimi"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Sukunimi"
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Sähköposti"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Puhelin"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Katuosoite"
              value={formData.streetaddress}
              onChange={(e) => handleChange('streetaddress', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Postinumero"
              value={formData.postcode}
              onChange={(e) => handleChange('postcode', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Kaupunki"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Peruuta</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddCustomer;
