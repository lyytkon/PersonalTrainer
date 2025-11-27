import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import dayjs, { Dayjs } from 'dayjs';
import { Customer, CustomersResponse } from '../types';

interface AddTrainingProps {
  onTrainingAdded: (message: string, severity?: 'success' | 'error') => void;
}

interface TrainingFormData {
  date: Dayjs;
  activity: string;
  duration: string;
  customer: string;
}

function AddTraining({ onTrainingAdded }: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<TrainingFormData>({
    date: dayjs(),
    activity: '',
    duration: '',
    customer: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
      .then(response => response.json())
      .then((data: CustomersResponse) => {
        setCustomers(data._embedded.customers);
      })
      .catch(error => console.error('Virhe haettaessa asiakkaita:', error));
  };

  const handleOpen = () => {
    setFormData({
      date: dayjs(),
      activity: '',
      duration: '',
      customer: ''
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setFormData({
        ...formData,
        date: newDate
      });
    }
  };

  const handleSubmit = () => {
    const trainingData = {
      date: formData.date.toISOString(),
      activity: formData.activity,
      duration: Number(formData.duration),
      customer: formData.customer
    };

    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trainingData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Harjoituksen lisäys epäonnistui');
        }
        onTrainingAdded('Harjoitus lisätty onnistuneesti!', 'success');
        handleClose();
      })
      .catch(error => {
        console.error('Virhe:', error);
        onTrainingAdded('Virhe harjoituksen lisäyksessä', 'error');
      });
  };

  return (
    <>
      <Button onClick={handleOpen} startIcon={<AddIcon />} variant="contained" color="primary">
        Lisää harjoitus
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lisää uusi harjoitus</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Asiakas</InputLabel>
            <Select
              name="customer"
              value={formData.customer}
              onChange={handleSelectChange}
              label="Asiakas"
            >
              {customers.map((customer) => (
                <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                  {customer.firstname} {customer.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Päivämäärä ja aika"
              value={formData.date}
              onChange={handleDateChange}
              format="DD.MM.YYYY HH:mm"
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense"
                }
              }}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            name="activity"
            label="Harjoituksen nimi"
            type="text"
            fullWidth
            value={formData.activity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Kesto (minuutit)"
            type="number"
            fullWidth
            value={formData.duration}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Peruuta</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lisää
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddTraining;
