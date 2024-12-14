import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]); // State to hold list of events
  const [error, setError] = useState(''); // State to hold error messages

  useEffect(() => {
      document.title = "Campus Connect";
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        // Fetch events from API
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(response.data); // Set fetched events in state
      } catch (err) {
        setError('An error occurred while fetching the events.'); // Handle errors
        console.error(err);
      }
    };

    fetchEvents(); // Fetch events when component loads
  }, []);

  // Helper function to check if the event is new for the user
  const isNewEvent = (eventId) => {
    const viewedEvents = JSON.parse(localStorage.getItem('viewedEvents')) || [];
    return !viewedEvents.includes(eventId); // Event is new if it's not in the viewed events list
  };

  // Function to mark all current events as viewed by the user, memoized with useCallback
  const markEventsAsViewed = useCallback(() => {
    const viewedEvents = JSON.parse(localStorage.getItem('viewedEvents')) || [];
    const newViewedEvents = [
      ...new Set([...viewedEvents, ...events.map(event => event._id)]), // Merge new event IDs with existing viewed ones
    ];
    localStorage.setItem('viewedEvents', JSON.stringify(newViewedEvents));
  }, [events]);

  // Mark all events as viewed when events are loaded
  useEffect(() => {
    if (events.length > 0) {
      markEventsAsViewed(); // Mark the current events as viewed once they're fetched
    }
  }, [events, markEventsAsViewed]); // Add markEventsAsViewed to the dependency array

  return (
    <div className="event-list-container">
      <h2>Upcoming Events</h2>

      {error && <p className="error-message">{error}</p>} {/* Display error if exists */}

      {events.length > 0 ? (
        events.map((event) => (
          <a key={event._id} href={`/event/${event._id}`} className="textdecor">
            <div className="event-card">
              {isNewEvent(event._id) && <div className="new-ribbon">New</div>} {/* Show 'New' ribbon if event is new */}
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
              </div>
              <div className="event-content">
                <h1>{event.title}</h1>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                <p>Location: {event.location}</p>
              </div>
            </div>
          </a>
        ))
      ) : (
        !error && <p className="white">No events available.</p> /* Display message if no events */
      )}
    </div>
  );
};

export default EventList;
