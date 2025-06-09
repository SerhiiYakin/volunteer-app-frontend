import * as React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

export default function FooterComponent() {
  return (
    <Box sx={{ bgcolor: '#0b1d03', color: 'white', py: 6}}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Волонтерський Хаб
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: '#ccc' }}>
              Поєднання волонтерів значимими можливостями.
            </Typography>
          </Grid>

          {}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Швидкі посилання
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/discover" color="inherit" underline="hover" sx={{ color: '#aaa' }}>
              Огляд можливостей
              </Link>
              <Link href="/organizations" color="inherit" underline="hover" sx={{ color: '#aaa' }}>
                Організації
              </Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ color: '#aaa' }}>
                Про нас
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ color: '#aaa' }}>
                Допомога
              </Link>
            </Box>
          </Grid>

          {}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Популярні категорії
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Навколишнє середовище
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
