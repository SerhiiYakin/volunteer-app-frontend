import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/register', { username, email, password });

      // Зберігаємо email в localStorage
      localStorage.setItem('userEmail', email);

      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" align="center" sx={{ color: 'rgba(7, 33, 0, 1)' }}>Реєстрація</Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            required
            label="Юзернейм"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Пошта"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Пароль"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: 'rgba(121, 122, 31, 1)' }}>
            Зареєструватися
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
