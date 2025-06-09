import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
  Chip,
  Stack
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventCard({
  event,
  setFilteredEvents,
  currentUser
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isParticipant = event.eventParticipants?.some(
    p => p.user.id === currentUser?.id
  );
  const isOrganizer = event.eventParticipants?.some(
    p => p.user.id === currentUser?.id && p.role === 'organizer'
  );

  const formattedDate = new Date(event.dateTime).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const shouldShowImage =
    location.pathname !== '/map' && location.pathname !== '/my-events';

  const handleJoin = eventId => {
    if (event.status === 'passed') {
      alert('Cannot join a passed event');
      return;
    }
    if (!currentUser) {
      navigate('/login');
      return;
    }
    axios
      .post(
        `http://localhost:8080/events/${eventId}/participants`,
        {},
        { withCredentials: true }
      )
      .then(res => {
        alert(res.data);
        return axios.get('http://localhost:8080/events', {
          withCredentials: true
        });
      })
      .then(res => setFilteredEvents(res.data))
      .catch(err => {
        alert(err.response?.data || 'Error joining event');
      });
  };

  return (
    <Card
      sx={{
        mb: 2,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        width: 340
      }}
    >
      {shouldShowImage && event.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:8080${event.imageUrl}`}
          alt={event.title}
          sx={{ borderRadius: 2, m: 1, maxWidth: 320 }}
        />
      )}

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={event.category} color="success" size="small" />
          <Chip
            label={event.status.toUpperCase()}
            color={event.status === 'current' ? 'primary' : 'default'}
            size="small"
          />
        </Stack>

        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {formattedDate}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {event.description}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: 'block' }}
        >
          📍 {event.location}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/events/${event.id}`)}
            sx={{ flexGrow: 1, textTransform: 'none', borderRadius: 20 }}
          >
            Переглянути
          </Button>

          {!isOrganizer && !isParticipant && event.status === 'current' && (
            <Button
              variant="contained"
              onClick={() => handleJoin(event.id)}
              sx={{ textTransform: 'none', borderRadius: 20 }}
            >
              Доєднатися
            </Button>
          )}

          {isOrganizer && (
            <Button
            variant="outlined"
            onClick={() => navigate(`/my-events/${event.id}/edit`)}
            sx={{ textTransform: 'none', borderRadius: 20 }}
          >
            Редагувати
          </Button>
          )}

          {isParticipant && !isOrganizer && (
            <Button
              variant="outlined"
              disabled
              sx={{ textTransform: 'none', borderRadius: 20 }}
            >
              Ви вже учасник
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
