import React, { useState, useEffect } from 'react';
import {
  Container, Tabs, Tab, Box, List, ListItemButton,
  ListItemText, Badge, Typography, Button, Card, CardContent, IconButton
} from '@mui/material';
import { BookmarkBorder, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function NotificationsPage() {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/notifications', { withCredentials:true })
      .then(r => setAll(r.data));
  }, []);

  const filtered = (() => {
    if (filter === 'unread') return all.filter(n => !n.read);
    if (filter === 'byEvent' && selected) {
      return all.filter(n => n.event.id === selected.event.id);
    }
    return all;
  })();

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Повідомлення</Typography>
      <Typography color="textSecondary" sx={{ mb:2 }}>
        Будь в курсі з повідомленнями від організатора
      </Typography>

      <Tabs value={filter} onChange={(_,v)=>{ setFilter(v); setSelected(null); }}>
        <Tab label="Усі" value="all" />
        <Tab label="Непрочитані" value="unread" />
        <Tab label="Подія" value="byEvent" />
      </Tabs>

      <Box sx={{ display:'flex', mt:2, gap:2 }}>
        <List sx={{ width:300, bgcolor:'background.paper', borderRadius:2 }}>
          {filtered.map(n => (
            <ListItemButton
              key={n.id}
              selected={selected?.id === n.id}
              onClick={() => setSelected(n)}
            >
              <ListItemText
                primary={n.event.title}
                secondary={n.message.slice(0,50) + '...'}
              />
              {!n.read && <Badge color="warning" variant="dot" />}
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flex:1 }}>
          {selected ? (
            <Card sx={{ borderRadius:2, p:2 }}>
              <CardContent>
                <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                  <Typography variant="h5">{selected.event.title}</Typography>
                  <Box>
                    <IconButton
                      onClick={() =>
                        axios.put(
                          `http://localhost:8080/notifications/${selected.id}/read`,
                          {},
                          { withCredentials:true }
                        ).then(() => {
                            window.location.reload();
                        })
                      }
                    >
                      <BookmarkBorder />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        axios.delete(
                          `http://localhost:8080/notifications/${selected.id}`,
                          { withCredentials:true }
                        ).then(() => {
                            window.location.reload();
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                {(() => {
                  const orgParticipant = selected.event.eventParticipants.find(
                    p => p.role === 'organizer'
                  );
                  const organizerName = orgParticipant?.user?.name || 'Organizer';
                  return (
                    <Typography variant="subtitle2" color="textSecondary">
                      Від: {organizerName}
                    </Typography>
                  );
                })()}

                <Typography sx={{ mt:2 }}>{selected.message}</Typography>

                <Box sx={{ mt:3, display:'flex', gap:2 }}>
                  <Button sx={{color:'black', borderColor:'black'}} variant="outlined">На жаль не можу доєднатись</Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Typography color="textSecondary">Оберіть повідомлення для перегляду</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
