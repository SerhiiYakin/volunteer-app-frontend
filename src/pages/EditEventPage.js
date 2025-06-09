import React, { useState, useEffect } from 'react';
import {
  Container, Grid, TextField, Button, Typography,
  Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationPicker({ coords, setCoords }) {
  const center = coords || { lat: 43.7, lng: -79.42 };
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });
    return coords ? <Marker position={[coords.lat, coords.lng]} /> : null;
  }

  return (
    <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <MapContainer center={[center.lat, center.lng]} zoom={6} style={{ height: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
}


export default function EditEventPage() {
        const { id } = useParams();
        const navigate = useNavigate();
        const [duration, setDuration] = useState(1);
        const [banner, setBanner] = useState(null);
        const [eventData, setEventData] = useState({
            eventParticipants: [],
            title: '',
            description: '',
            location: '',
            dateTime: new Date().toISOString(),
            category: '',
            durationHours: 1,
            latitude: null,
            longitude: null
          });
        const [currentUser, setCurrentUser] = useState(null);
        const [notification, setNotification] = useState('');
        const [loading, setLoading] = useState(true);
        
      
        // Load event and user data
        useEffect(() => {
          const email = localStorage.getItem('userEmail') || sessionStorage.getItem('email');
          if (!email) return navigate('/login');
      
          const fetchData = async () => {
            try {
              const [userRes, eventRes] = await Promise.all([
                axios.get(`http://localhost:8080/auth/user/${email}`, { withCredentials: true }),
                axios.get(`http://localhost:8080/events/${id}`, { withCredentials: true })
              ]);
              
              setCurrentUser(userRes.data);
              setEventData({
                ...eventRes.data,
                eventParticipants: eventRes.data.eventParticipants || []
              });
            } catch (error) {
              console.error('Error loading data:', error);
              navigate('/my-events');
            } finally {
              setLoading(false);
            }
          };
      
          fetchData();
        }, [id, navigate]);
      

 
  const handleChange = e => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  // Оновлення координат
  const setCoords = ({ lat, lng }) => {
    setEventData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleBannerChange = e => setBanner(e.target.files[0]);

  // Відправити оновлення події
  const handleUpdate = async () => {
    try {

        let imageUrl = eventData.imageUrl;
      
        // Upload new banner if exists
        if (banner) {
          const formData = new FormData();
          formData.append('file', banner);
          const uploadRes = await axios.post(
            'http://localhost:8080/events/upload-image',
            formData,
            { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
          );
          imageUrl = uploadRes.data;
        }
        await axios.put(
        `http://localhost:8080/events/${id}`,
        {
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            dateTime: eventData.dateTime,
            category: eventData.category,
            latitude: eventData.latitude,
            longitude: eventData.longitude,
            durationHours: eventData.durationHours, 
            imageUrl: imageUrl
        },
        { withCredentials: true }
      );
      alert('Event updated');
      navigate('/my-events');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating event');
    }
  };

    const handleNotify = async () => {
    if (!notification.trim()) {
      alert('Enter a message');
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:8080/notifications/events/${id}`,
        { message: notification },
        { withCredentials: true }
      );
      console.log('Notification sent to all participants');
      setNotification('');
    } catch (err) {
      console.error(err);
      alert('Error sending notification');
    }
  };
  
  if (!eventData) return null;

  // Розділяємо дату й час для полів
  const [datePart, timePartWithMillis] = eventData.dateTime.split('T');
  const timeValue = timePartWithMillis.split('.')[0];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Редагувати</Typography>
      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, md: 8 }}>
          <Box component="form" noValidate autoComplete="off"
               sx={{ p:3, boxShadow:3, borderRadius:2, bgcolor:'white' }}
          >
            <TextField
              fullWidth name="title" label="Заголовок"
              value={eventData.title} onChange={handleChange}
              sx={{ mb:2 }}
            />
            <TextField
              fullWidth name="description" label="Опис" multiline rows={4}
              value={eventData.description} onChange={handleChange}
              sx={{ mb:2 }}
            />
            <TextField
              fullWidth name="location" label="Локація"
              value={eventData.location} onChange={handleChange}
              sx={{ mb:2 }}
            />

            <Grid container spacing={2}>
                <Grid size={{xs:6}}>
                <TextField
                    fullWidth
                    name="date"
                    type="date"
                    value={datePart}
                    onChange={e => setEventData(prev => ({
                    ...prev,
                    dateTime: `${e.target.value}T${timeValue}`
                    }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />
                </Grid>
                <Grid size={{xs:6}}>
                <TextField
                    fullWidth
                    name="time"
                    type="time"
                    value={timeValue}
                    onChange={e => setEventData(prev => ({
                    ...prev,
                    dateTime: `${datePart}T${e.target.value}`
                    }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />
                </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb:2 }}>
              <InputLabel>Категорія</InputLabel>
              <Select
                name="category"
                value={eventData.category}
                onChange={handleChange}
              >
                <MenuItem value="Environment">Навколишнє середовище</MenuItem>
                <MenuItem value="Education">Освіта</MenuItem>
                <MenuItem value="Youth">Для молоді</MenuItem>
              </Select>
            </FormControl>
            <TextField
                fullWidth
                type="number"
                label="Тривалість (годин)"
                name="durationHours"
                value={eventData.durationHours || 1}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ mb: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb:2 }}>
              Додати зображення<input type="file" hidden onChange={handleBannerChange}/>
            </Button>

            {/* Карта для вибору локації */}
            <Typography variant="subtitle1" sx={{ mb:1 }}>Обрати локацію</Typography>
            <LocationPicker
              coords={
                eventData.latitude && eventData.longitude
                  ? { lat: eventData.latitude, lng: eventData.longitude }
                  : null
              }
              setCoords={setCoords}
            />

            <Button
              fullWidth variant="contained"
              sx={{ bgcolor: 'rgba(121,122,31,1)' }}
              onClick={handleUpdate}
            >
              Оновити інформацію
            </Button>
          </Box>

          <Box sx={{ mt:4, p:3, boxShadow:3, borderRadius:2, bgcolor:'white' }}>
            <Typography variant="h6" sx={{ mb:2 }}>Надіслати повідомлення</Typography>
            <TextField
              fullWidth multiline rows={3}
              placeholder="Ваше повідомлення учасникам"
              value={notification}
              onChange={e => setNotification(e.target.value)}
              sx={{ mb:2 }}
            />
            <Button
              sx={{ bgcolor: 'rgba(121,122,31,1)' }}
              fullWidth variant="contained"
              onClick={handleNotify}
            >
              Надіслати
            </Button>
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
       
        </Grid>
      </Grid>
    </Container>
  );
}
