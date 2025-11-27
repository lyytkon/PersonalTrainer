import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Customer } from '../types';

interface EditCustomerProps {
  customer: Customer;
  onCustomerUpdated: (message: string, severity?: 'success' | 'error') => void;
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

function EditCustomer({ customer, onCustomerUpdated }: EditCustomerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstname: customer.firstname || '',
    lastname: customer.lastname || '',
    email: customer.email || '',
    phone: customer.phone || '',
    streetaddress: customer.streetaddress || '',
    postcode: customer.postcode || '',
    city: customer.city || ''
  });

  const handleOpen = () => {
    setFormData({
      firstname: customer.firstname || '',
      lastname: customer.lastname || '',
      email: customer.email || '',
      phone: customer.phone || '',
      streetaddress: customer.streetaddress || '',
      postcode: customer.postcode || '',
      city: customer.city || ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    fetch(customer._links.self.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Asiakkaan päivitys epäonnistui');
        }
        onCustomerUpdated('Asiakas päivitetty onnistuneesti!', 'success');
        handleClose();
      })
      .catch(error => {
        console.error('Virhe:', error);
        onCustomerUpdated('Virhe asiakkaan päivityksessä', 'error');
      });
  };

  return (
    <>
      <Button onClick={handleOpen} startIcon={<EditIcon />} size="small">
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Muokkaa asiakasta</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="Etunimi"
            type="text"
            fullWidth
            value={formData.firstname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Sukunimi"
            type="text"
            fullWidth
            value={formData.lastname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Sähköposti"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Puhelin"
            type="text"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="streetaddress"
            label="Katuosoite"
            type="text"
            fullWidth
            value={formData.streetaddress}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="postcode"
            label="Postinumero"
            type="text"
            fullWidth
            value={formData.postcode}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="Kaupunki"
            type="text"
            fullWidth
            value={formData.city}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Peruuta</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditCustomer;
