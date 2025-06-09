import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Container, TextField, Button, Box, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('search'); 
  const categoryFilter = params.get('category');


  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios.get(`http://localhost:8080/auth/user/${email}`, { withCredentials: true })
        .then(response => setCurrentUser(response.data))
        .catch(() => {
          localStorage.removeItem('userEmail');
          setCurrentUser(null);
        });
    } else {
      setCurrentUser(null);
    }

    // Fetch events
    axios.get('http://localhost:8080/events')
      .then(res => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
    }
    if (categoryFilter) {
      setCategory(categoryFilter);
    }
  }, [searchQuery, categoryFilter]);

  const handleFilter = () => {
    let filtered = [...events];
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }
    if (date) {
      filtered = filtered.filter(event => event.dateTime.startsWith(date));
    }
    setFilteredEvents(filtered);
  };

  const handleJoin = (eventId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    console.log(`User ${currentUser.email} joining event ${eventId}`);
  };
  

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Filter Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <TextField
          placeholder="Пошук локацій або подій"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Категорія</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Environment">Навколишнє середовище</MenuItem>
            <MenuItem value="Education">Освіта</MenuItem>
            <MenuItem value="Youth">Для молоді</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ minWidth: 150 }}
        />
        <Button variant="contained" onClick={handleFilter} sx={{ bgcolor: 'rgba(121, 122, 31, 1)' }}>
          Фільтр
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 3, margin: '25px' }}>
            <MapContainer center={[43.7, -79.42]} zoom={10} 
            style={{ height: '800px', minWidth: '500px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filteredEvents.map(event => (
                event.latitude && event.longitude && (
                  <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong>{event.title}</strong><br />
                      {event.location}<br />
                      {new Date(event.dateTime).toLocaleString()}
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 3, margin: '25px', maxHeight: '750px', overflowY: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Події поруч
            </Typography>

            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onView={() => {}}
                onJoin={handleJoin}
                currentUser={currentUser}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MapPage;
