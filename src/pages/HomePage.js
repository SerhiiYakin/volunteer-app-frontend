import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import PopularCauses from '../components/PopularCauses';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import axios from 'axios';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8080/auth/user/${email}`, { withCredentials: true })
        .then(response => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('userEmail');
          setUser(null);
        });
    } else {
      setUser(null);
    }

    axios.get('http://localhost:8080/events', { withCredentials: true })
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error loading events:', error))
      .finally(() => setLoading(false));
  }, [navigate, email]);

  const handleSearch = () => {
    if (searchTerm) {
      // Navigate to /map with search term as query parameter
      navigate(`/map?search=${searchTerm}`);
    }
  };

  const handleCategoryClick = (category) => {
    // Navigate to the map page with the selected category as a filter
    navigate(`/map?category=${category}`);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: '#f7f8eb', py: 6 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ maxWidth: '50%' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Зміни своє навколишнє середовище!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Знайди свої волонтерські можливості у твоїй громаді
            </Typography>

            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                placeholder="Пошук можливостей..."
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white', flexGrow: 1, mr: 2 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: 'rgba(121, 122, 31, 1)' }}>
                Пошук
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label="#Навколишнє середовище" 
                variant="outlined"
                onClick={() => handleCategoryClick('Environment')}
              />
              <Chip 
                label="#Освіта" 
                variant="outlined"
                onClick={() => handleCategoryClick('Education')}
              />
              <Chip 
                label="#Для молоді" 
                variant="outlined"
                onClick={() => handleCategoryClick('Youth')}
              />
            </Box>
          </Box>

          <Box sx={{ maxWidth: 400 }}>
            <img
              src='/img/main.png' 
              alt="Volunteers"
              style={{ width: '100%', borderRadius: 12 }}
            />
          </Box>
        </Container>
      </Box>

      <PopularCauses />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center'}}>
          Можливості зараз
        </Typography>

        <Grid container spacing={4}>
          {events.slice(0, 3).map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard
                key={event.id}
                event={event}
                onView={() => {}}
                onJoin={() => {}}
                currentUser={user}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default HomePage;
