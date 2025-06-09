import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Логін користувача
      const loginResponse = await axios.post(
        'http://localhost:8080/auth/login', 
        { email, password },
        {
          withCredentials: true,  // Включаємо credentials, щоб використовувати сесію
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Якщо логін успішний
      if (loginResponse.status === 200) {
        // Після логіну отримуємо користувача з сесії
        const userResponse = await axios.get(
          `http://localhost:8080/auth/check-auth`,
          {
            withCredentials: true,  // Використовуємо сесію для отримання даних користувача
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (userResponse.data) {
          localStorage.setItem('userEmail', email);  // Зберігаємо email у localStorage
          localStorage.setItem('userData', JSON.stringify(userResponse.data)); // Зберігаємо дані користувача у localStorage
          navigate('/'); // Перехід на домашню сторінку
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 401) {
        alert('Невірна пошта або пароль');
      } else if (error.response?.status === 404) {
        alert('Користувача не знайдено');
      } else {
        alert('Помилка сервера. Спробуйте пізніше.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(7, 33, 0, 1)',
            mb: 3
          }}
        >
          Увійти в систему
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: '100%',
            mt: 2
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            required
            label="Пошта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: 'rgba(121, 122, 31, 1)',
              '&:hover': {
                bgcolor: 'rgba(91, 92, 11, 1)'
              }
            }}
          >
            Увійти
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
