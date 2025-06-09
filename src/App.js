import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import EventDetailsPage from './components/EventDetailsPage';
import CreateEventPage from './components/CreateEventPage';
import { Box } from '@mui/material';
import MapPage from './pages/MapPage';
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';
import NotificationsPage from './pages/NotificationsPage';
import MyAccountPage from './pages/MyAccountPage';

function App() {
  return (
    <Router>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh' 
      }}>
        <HeaderComponent />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/my-events/:id/edit" element={<EditEventPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/account" element={<MyAccountPage />} />
          </Routes>
        </Box>

        <FooterComponent />
      </Box>
    </Router>
  );
}

export default App;
