import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyEvents.css'; 

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
      document.title = "Campus Connect";
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        // Fetch the registered events with Authorization header
        const response = await axios.get('http://localhost:5000/api/events/myevents', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        console.log(response);
        

        if (response.status === 200) {
          setEvents(response.data); // Store the events in state
        } else {
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (err) {
        //  setError('An error occurred while fetching your events.');
        console.error(err);
      }
    };

    fetchMyEvents();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (events.length === 0) return <p align="Center"><b>No Events Found</b></p>;

  return (
    <div className="my-events-container">
      <h1 className='rcenter'>My Registered Events</h1>
      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-image-container">
              {/* Example image, replace with actual image data if available */}
              <img src={event.image} alt={event.title} className="event-image" />
            </div>
            <div className="event-content">
            <h1 >{event.title}</h1>
            <p className='white'>{event.description}</p>
            <p className='white'>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
            <p className='white'>Location: {event.location}</p>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
