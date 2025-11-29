import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dayjsLocalizer, View } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, CircularProgress } from '@mui/material';
import 'dayjs/locale/fi';
import { TrainingsResponse, Training } from '../types';

dayjs.locale('fi');
const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Training;
}

function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('week');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
      .then(response => response.json())
      .then((data: TrainingsResponse) => {
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
            const calendarEvents: CalendarEvent[] = results.map(training => ({
              title: `${training.activity} - ${training.customer ? training.customer.firstname + ' ' + training.customer.lastname : 'N/A'}`,
              start: new Date(training.date),
              end: dayjs(training.date).add(training.duration, 'minute').toDate(),
              resource: training
            }));
            setEvents(calendarEvents);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Virhe haettaessa harjoituksia:', error);
        setLoading(false);
      });
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
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
      <Box mb={3}>
        <Typography variant="h4">
          Harjoituskalenteri
        </Typography>
      </Box>
      <Box sx={{ height: '80vh', width: '100%', '& .rbc-toolbar': { marginBottom: '10px' } }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day']}
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          messages={{
            next: "Seuraava",
            previous: "Edellinen",
            today: "Tänään",
            month: "Kuukausi",
            week: "Viikko",
            day: "Päivä",
            agenda: "Agenda",
            date: "Päivämäärä",
            time: "Aika",
            event: "Tapahtuma",
            noEventsInRange: "Ei harjoituksia tällä ajanjaksolla."
          }}
        />
      </Box>
    </div>
  );
}

export default Calendar;
