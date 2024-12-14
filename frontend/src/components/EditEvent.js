import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EditEvent.css';
import art from './assets/art.png';
import coding from './assets/coding.jpg';
import music from './assets/music.jpg';
import Sport from './assets/sports.jpg';
import cultural from './assets/cultural.jpg';

const images = [
  art, coding, music, Sport, cultural
];

const EditEvent = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
      document.title = "Campus Connect";
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/details/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/events/edit/${id}`, eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!eventData) return <div>Loading...</div>;


  return (
    <div className="body-container">
      <h2>Edit Event</h2>

      <label>Title</label>
      <input
        type="text"
        value={eventData.title}
        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
      />

      <label>Description</label>
      <textarea
        value={eventData.description}
        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
      />

      <label>Date</label>
      <input
        type="date"
        value={eventData.date}
        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
      />

      <label>Time</label>
      <input
        type="time"
        value={eventData.time}
        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
      />

      <label>Location</label>
      <input
        type="text"
        value={eventData.location}
        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
      />

      <label>Club Name</label>
      <input
        type="text"
        value={eventData.clubName}
        onChange={(e) => setEventData({ ...eventData, clubName: e.target.value })}
      />

      <label>Event Type</label>
      <select
        value={eventData.eventType}
        onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
      >
        <option value="Individual">Individual</option>
        <option value="Group">Group</option>
      </select>

      {eventData.eventType === 'Group' && (
        <div>
          <label>Number of Participants</label>
          <input
            type="number"
            value={eventData.numParticipants}
            onChange={(e) => setEventData({ ...eventData, numParticipants: parseInt(e.target.value, 10) || 1 })}
          />
        </div>
      )}

      <label>Department</label>
      <input
        type="text"
        value={eventData.department}
        onChange={(e) => setEventData({ ...eventData, department: e.target.value })}
      />

      <label>Rules</label>
      <textarea
        value={eventData.rules}
        onChange={(e) => setEventData({ ...eventData, rules: e.target.value })}
      />

      <label>Event Image</label>
      <h3>Select an Image:</h3>
      <div className="image-selection">
        {images.map((img, index) => (
          <div key={index} className="image-option">
            <img
              src={img}
              alt={`Event Option ${index + 1}`}
              className={`image-thumbnail ${eventData.image === img ? 'selected' : ''}`}
              onClick={() => setEventData({ ...eventData, image: img })}
            />
          </div>
        ))}
      </div>

      <button onClick={handleUpdate}>Update Event</button>
    </div>
  );
};

export default EditEvent;