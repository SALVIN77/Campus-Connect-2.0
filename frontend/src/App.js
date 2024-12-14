import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import Login from './components/Login';
import Register from './components/Register';
import CreatorEvents from './components/CreatorEvents';
import CreateEvent from './components/CreateEvent';
import Profile from './components/Profile';
import EventDetail from './components/EventDetail'; // Import EventDetail
import PrivateRoute from './components/PrivateRoute';
import MyEvents from './components/MyEvents'; 
import EditEvent from './components/EditEvent';


function App() {
  // Check if the user is authenticated by checking for a token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      {/* Navbar */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* If user is authenticated, redirect to events page; otherwise, show LandingPage */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/events" /> : <LandingPage />} />

        {/* Route for events, which should only be accessible if authenticated */}
        <Route path="/events" element={<PrivateRoute role={['student', 'coordinator']}><EventList /></PrivateRoute>} />

        {/* Event detail route */}
        <Route path="/event/:id" element={<PrivateRoute role={['student', 'coordinator']}><EventDetail /></PrivateRoute>} />


        <Route path="/edit-event/:id" element={<PrivateRoute role="coordinator"><EditEvent /></PrivateRoute>} />

        <Route path="/" element={<LandingPage />} />



      
        {/* Login and Register routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/events" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/register" element={<PrivateRoute role="admin"><Register /></PrivateRoute>} /> */}


        {/* Protected route for creating an event */}
        <Route path="/creatorevents" element={<PrivateRoute role="coordinator"><CreatorEvents /></PrivateRoute>} />
        <Route path="/create-event" element={<PrivateRoute role="coordinator"><CreateEvent /></PrivateRoute>} />
        <Route path="/myevents" element={<PrivateRoute role="student"><MyEvents /></PrivateRoute>} />
       
        


        {/* Protected route for profile */}
        <Route path="/profile" element={<PrivateRoute role={['student', 'coordinator']}><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
