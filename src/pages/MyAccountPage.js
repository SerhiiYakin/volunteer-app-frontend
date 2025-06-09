import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography,
  Avatar, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Box, List, ListItem, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';

export default function MyAccountPage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/auth/profile', { withCredentials: true })
      .then(r => setProfile(r.data))
      .catch(() => {
        navigate('/login')
    });
  }, []);

  if (!profile) return null;

  const formatDate = isoString => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}>
              {profile.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="h6">{profile.username}</Typography>
            <Typography
              color="textSecondary"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Рівень: {profile.lvlName}
              {Array.from({ length: profile.lvlInApp }).map((_, idx) => (
                <StarIcon key={idx} fontSize="small" sx={{ color: 'gold' }} />
              ))}
            </Typography>
            <Button variant="contained" sx={{ bgcolor: 'rgba(121,122,31,1)' }}>
              Налаштування
            </Button>
          </Card>
        </Grid>

        <Grid container spacing={2} size={{ xs: 12, md: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Активні години</Typography>
                <Typography variant="h5">{profile.hoursVolunteered}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Завершених подій</Typography>
                <Typography variant="h5">{profile.eventsCompleted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Оцінка впливу</Typography>
                <Typography variant="h5">{profile.impactScore}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Activities */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Поточні події</Typography>
                <List>
                  {profile.upcomingEvents.map(ev => (
                    <React.Fragment key={ev.id}>
                      <ListItem>
                        <Box>
                          <Typography fontWeight="bold">{ev.title}</Typography>
                          <Typography variant="body2">
                            Наступний: {formatDate(ev.dateTime)}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          sx={{ ml: 'auto', color: 'rgba(121,122,31,1)' }}
                          onClick={() => {navigate(`/events/${ev.id}`)}}
                        >
                          Переглянути деталі
                        </Button>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {profile.upcomingEvents.length === 0 && (
                    <Typography color="textSecondary">
                      Немає наближаючихся подій
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Past Events */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Минулі події</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Подія</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>години</TableCell>
                      <TableCell>Вплив</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.pastEvents.map(ev => (
                      <TableRow key={ev.id}>
                        <TableCell>{ev.title}</TableCell>
                        <TableCell>{formatDate(ev.dateTime)}</TableCell>
                        <TableCell>{ev.durationHours}</TableCell>
                        <TableCell>⭐ 10</TableCell>

                      </TableRow>
                    ))}
                    {profile.pastEvents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Немає минулих подій
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
