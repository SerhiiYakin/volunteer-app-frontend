import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  return position ? (
    <Marker position={position}></Marker>
  ) : null;
}

function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      navigate('/login');
    } else {
      axios.get(`http://localhost:8080/auth/${storedEmail}`)
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('userEmail');
          navigate('/login');
        });
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    let imageUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const uploadRes = await axios.post('http://localhost:8080/events/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      imageUrl = uploadRes.data;
    }

    const eventData = {
      title,
      description,
      location,
      dateTime,
      imageUrl,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
      eventParticipants: [
        {
          user: { id: user.id },
          role: 'organizer',
        },
      ],
    };

    try {
      await axios.post('http://localhost:8080/events', eventData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ color: 'rgba(7, 33, 0, 1)' }}>
        Create Event
      </Typography>
      <Box component="form" onSubmit={handleCreate} sx={{ mt: 2 }}>
        <TextField fullWidth label="Title" required onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Description" required multiline rows={4} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Location" required onChange={(e) => setLocation(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth type="datetime-local" required onChange={(e) => setDateTime(e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />

        <Button variant="contained" component="label" sx={{ bgcolor: 'rgba(121, 122, 31, 1)', mb: 2 }}>
          Upload Image
          <input type="file" hidden onChange={handleImageChange} />
        </Button>

        {previewImage && (
          <Box sx={{ mt: 2 }}>
            <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: 12 }} />
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Choose event location on the map:
          </Typography>

          <MapContainer center={[48.3794, 31.1656]} zoom={6} style={{ height: '300px', borderRadius: '12px' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setLocation={setCoordinates} />
          </MapContainer>
        </Box>

        <Button variant="contained" type="submit" sx={{ mt: 3, bgcolor: 'rgba(121, 122, 31, 1)' }}>
          Create
        </Button>
      </Box>
    </Container>
  );
}

export default CreateEventPage;
