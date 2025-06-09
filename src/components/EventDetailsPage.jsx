import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Box,
  Typography, Button, CardMedia
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EventCard from './EventCard';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!id) return;

    const email = localStorage.getItem('userEmail') || sessionStorage.getItem('email');
    if (!email) {
      navigate('/login');
      return;
    }

    // Завантажуємо профіль
    axios.get(`http://localhost:8080/auth/user/${email}`, { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(() => navigate('/login'));

    // Деталі події
    axios.get(`http://localhost:8080/events/${id}`, { withCredentials: true })
      .then(res => setEvent(res.data))
      .catch(() => alert('Error loading event'));

    // Інші доступні події
    axios.get('http://localhost:8080/events', { withCredentials: true })
      .then(res => {
        const others = res.data
          .filter(e => e.status === 'current' && e.id !== Number(id));
        setOtherEvents(others);
      })
      .catch(() => {});
  }, [id, navigate]);

  if (!event) return null;


  const formattedDate = new Date(event.dateTime).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  const hasCoords =
    typeof event.latitude === 'number' &&
    typeof event.longitude === 'number' &&
    event.latitude !== 0 &&
    event.longitude !== 0;

    const participants = (event.participants || []).map(p => ({
    id: p?.id,
    role: p?.role,
    rating: p?.rating,
    user: p?.user || {}
  }));
  
  const amIOrganizer = participants.some(
    p => p.user?.id === currentUser?.id && p.role === 'organizer'
  );

  const isParticipant = participants.some(
    p => p.user?.id === currentUser?.id && p.role === 'participant'
  );
  
  const alreadyJoined = participants.some(
    p => p.user?.id === currentUser?.id
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 3 }}>
            {event.imageUrl && (
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:8080${event.imageUrl}`}
                alt={event.title}
                sx={{ borderRadius: 2, mb: 2 }}
              />
            )}

            <Typography variant="h4" sx={{ mb: 2 }}>
              {event.title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {formattedDate} — {event.durationHours} год.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {event.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              📍 {event.location}
            </Typography>

            {hasCoords && (
              <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                <MapContainer
                  center={[event.latitude, event.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[event.latitude, event.longitude]} />
                </MapContainer>
              </Box>
            )}

            {!amIOrganizer && !isParticipant && (
              <Button
                variant="contained"
                sx={{ mb: 3, textTransform: 'none' }}
                onClick={() => {
                  axios.post(
                    `http://localhost:8080/events/${id}/participants`,
                    {},
                    { withCredentials: true }
                  )
                    .then(() => axios.get(`http://localhost:8080/events/${id}`, { withCredentials: true }))
                    .then(res => setEvent(res.data))
                    .catch(err => alert(err.response?.data || 'Error joining'));
                }}
              >
                Приєднатись
              </Button>
            )}

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Учасники та оцінки
            </Typography>
            {participants.map(p => (
              <Box
                key={p.id}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Typography sx={{ flexGrow: 1 }}>
                  {p.user.username} ({p.role})
                </Typography>

                {amIOrganizer ? (
                  <Rating
                    value={p.rating || 0}
                    precision={1}
                    onChange={(_, value) => {
                      axios.post(
                        `http://localhost:8080/events/${id}/participants/${p.id}/rating`,
                        { rating: value },
                        { withCredentials: true }
                      ).then(() => {
                        setEvent(ev => ({
                          ...ev,
                          participants: ev.participants.map(pp =>
                            pp.id === p.id ? { ...pp, rating: value } : pp
                          )
                        }));
                      });
                    }}
                  />
                ) : (
                  <Rating value={p.rating || 0} readOnly />
                )}
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Інші доступні події
          </Typography>
          {otherEvents.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              currentUser={currentUser}
              setFilteredEvents={setOtherEvents}
              onView={eventId => navigate(`/events/${eventId}`)}
            />
          ))}
          {otherEvents.length === 0 && (
            <Typography color="textSecondary">
              Немає доступних подій.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
