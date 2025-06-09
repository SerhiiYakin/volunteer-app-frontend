import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HeaderComponent() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #ddd' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Назва */}
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'rgba(96,98,10,1)' }}
          >
            Волонтерська система
          </Typography>

          {/* Навігація */}
          <Stack direction="row" spacing={3} alignItems="center">
            <Button sx={{ color: '#505050', textTransform: 'none' }} onClick={() => navigate('/')}>
              Домашня сторінка
            </Button>
            <Button sx={{ color: '#505050', textTransform: 'none' }} onClick={() => navigate('/map')}>
              Карта подій
            </Button>
            {isAuthenticated && (
              <>
                <Button sx={{ color: '#505050', textTransform: 'none' }} onClick={() => navigate('/notifications')}>
                  Повідомлення
                </Button>
                <Button sx={{ color: '#505050', textTransform: 'none' }} onClick={() => navigate('/account')}>
                  Мій акаунт
                </Button>
                <Button sx={{ color: '#505050', textTransform: 'none' }} onClick={() => navigate('/my-events')}>
                  Мої події
                </Button>
              </>
            )}
          </Stack>

          {/* Кнопки справа */}
          <Stack direction="row" spacing={2}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'rgba(96,98,10,1)', borderRadius: '9999px', textTransform: 'none' }}
                  onClick={() => navigate('/register')}
                >
                  Зареєструватися
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(96,98,10,1)',
                    color: 'rgba(96,98,10,1)',
                    borderRadius: '9999px',
                    textTransform: 'none',
                  }}
                  onClick={() => navigate('/login')}
                >
                  Увійти
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(96,98,10,1)',
                  color: 'rgba(96,98,10,1)',
                  borderRadius: '9999px',
                  textTransform: 'none',
                }}
                onClick={handleLogout}
              >
                Вийти
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
