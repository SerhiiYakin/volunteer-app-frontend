import React, { useState, useEffect } from 'react';
import {
  Container, Grid, TextField, Button, Typography,
  Box, FormControl, MenuItem, Select, InputLabel, Modal
} from '@mui/material';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';

function LocationPickerModal({ open, onClose, setCoords }) {
  const [position, setPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setCoords(e.latlng);
      }
    });
    return position ? <Marker position={position} /> : null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: 600,
        height: 400, bgcolor: 'background.paper',
        borderRadius: 2, boxShadow: 24, p: 2
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Pick Location on Map</Typography>
        <MapContainer
          center={[43.7, -79.42]}
          zoom={6}
          style={{ height: '320px', borderRadius: '12px' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
        <Button
          fullWidth variant="contained"
          onClick={onClose}
          sx={{ mt: 2, bgcolor: 'rgba(121,122,31,1)' }}
        >Confirm Location</Button>
      </Box>
    </Modal>
  );
}

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [banner, setBanner] = useState(null);
  const [coords, setCoords] = useState(null);
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [duration, setDuration] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || sessionStorage.getItem('email');
    if (!email) return navigate('/login');

    axios.get(`http://localhost:8080/auth/user/${email}`, { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(() => navigate('/login'));

    axios.get('http://localhost:8080/events/my-events', { withCredentials: true })
      .then(res => setMyEvents(res.data.filter(e => e.status === 'current')))
      .catch(err => { if (err.response?.status === 401) navigate('/login'); });
  }, [navigate]);

  const handleBannerChange = e => setBanner(e.target.files[0]);

  const handleCreateEvent = async () => {
    const email = sessionStorage.getItem('email') || localStorage.getItem('userEmail');
    if (!email) return navigate('/login');

    try {
      let imageUrl = null;
      if (banner) {
        const fd = new FormData(); fd.append('file', banner);
        const upload = await axios.post(
          'http://localhost:8080/events/upload-image', fd,
          { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        );
        imageUrl = upload.data;
      }

      await axios.post('http://localhost:8080/events', {
        title,
        description,
        location: locationText,
        dateTime: `${date}T${time}`,
        durationHours: duration,
        imageUrl,
        latitude: coords?.lat || 0,
        longitude: coords?.lng || 0,
        category,
      }, { withCredentials: true });

      const res = await axios.get('http://localhost:8080/events/my-events', { withCredentials: true });
      setMyEvents(res.data.filter(e => e.status === 'current'));
      setTitle(''); setDescription(''); setLocationText('');
      setDate(''); setTime(''); setBanner(null); setCoords(null); setCategory('');
      alert('Подія створена успішно');
    } catch {
      alert('Помилка при створенні події');
    }
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>

        <Grid size={{ xs:12, md:8 }}>
          <Box component="form" noValidate autoComplete="off"
               sx={{ p:3, bgcolor:'white', boxShadow:3, borderRadius:2 }}>
            <Typography variant="h5" sx={{ mb:3, textAlign:'center' }}>
              Нова подія
            </Typography>

            <TextField fullWidth label="Заголовок" value={title}
              onChange={e => setTitle(e.target.value)} sx={{ mb:2 }} />

            <TextField fullWidth label="Опис" multiline rows={4}
              value={description} onChange={e => setDescription(e.target.value)}
              sx={{ mb:2 }} />

            <TextField fullWidth label="Локація"
              value={locationText} onChange={e => setLocationText(e.target.value)}
              sx={{ mb:2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs:6 }}>
                <TextField fullWidth type="date" value={date}
                  onChange={e => setDate(e.target.value)}
                  InputLabelProps={{ shrink:true }} inputProps={{ min: minDate }} sx={{ mb:2 }} />
              </Grid>
              <Grid size={{ xs:6 }}>
                <TextField fullWidth type="time" value={time}
                  onChange={e => setTime(e.target.value)}
                  InputLabelProps={{ shrink:true }} sx={{ mb:2 }} />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb:2 }}>
              <InputLabel>Категорія</InputLabel>
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <MenuItem value="Environment">Environment</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Youth">Youth</MenuItem>
              </Select>
            </FormControl>
            <TextField
            fullWidth
            type="number"
            label="Тривалість (годин)"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ mb:2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb:2 }}>
              Додати зображення<input type="file" hidden onChange={handleBannerChange}/>
            </Button>

            <Button fullWidth variant="outlined"
              onClick={() => setModalOpen(true)}
              sx={{ mb:2, color:'#0b1d03', borderColor:'#0b1d03' }}>
              Оберіть Локацію на карті
            </Button>

            <Button fullWidth variant="contained"
              sx={{ bgcolor:'rgba(121,122,31,1)' }}
              onClick={handleCreateEvent}>
              Створити
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs:12, md:4 }}>
          <Typography variant="h6" sx={{ mb:2 }}>Наближчі події</Typography>
          {myEvents.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              currentUser={currentUser}
              setFilteredEvents={setMyEvents}
              onView={id => navigate(`/events/${id}`)}
            />
          ))}
        </Grid>

      </Grid>

      <LocationPickerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setCoords={setCoords}
      />
    </Container>
  );
}
