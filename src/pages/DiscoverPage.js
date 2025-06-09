import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';

function DiscoverPage() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:8080/auth/${email}`)
      .then((res) => setUser(res.data))
      .catch(() => navigate('/login'));

    axios.get('http://localhost:8080/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Помилка при завантаженні подій:', error))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleViewEvent = async (eventId) => {
    const email = localStorage.getItem('userEmail');
    try {
      await axios.get(`http://localhost:8080/events/${eventId}?email=${email}`);
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Access denied:', error);
      setSnackbar({ open: true, message: 'Немає доступу до події', severity: 'error' });
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:8080/events/${eventId}/participants`, {
        user: { id: user.id },
      });
      setSnackbar({ open: true, message: 'Успішно приєднано до події!', severity: 'success' });

      const updated = await axios.get('http://localhost:8080/events');
      setEvents(updated.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Ви вже учасник або помилка!', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'rgba(7, 33, 0, 1)' }}>
        Знайти нові події
      </Typography>

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onView={handleViewEvent}
          onJoin={handleJoinEvent}
          currentUser={user}
        />
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DiscoverPage;
