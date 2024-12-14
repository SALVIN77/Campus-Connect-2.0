import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateEvent.css';
import art from './assets/art.png';
import coding from './assets/coding.jpg';
import music from './assets/music.jpg';
import Sport from './assets/sports.jpg';
import cultural from './assets/cultural.jpg';

const images = [
  art,coding,music,Sport,cultural
];

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [clubName, setClubName] = useState('');
  const [eventType, setEventType] = useState('Individual');
  const [numParticipants, setNumParticipants] = useState(1);
  const [department, setDepartment] = useState('');
  const [rules, setRules] = useState('');
  const [image, setImage] = useState(images[0]); // Default selected image
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events/create', {
        title,
        description,
        date,
        time,
        location,
        clubName,
        eventType,
        numParticipants,
        department,
        rules,
        image
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      window.location.href = '/';
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  useEffect(() => {
    document.title = "Campus Connect (Admin Dashboard)";
}, []);

  return (
    <div className="create-event-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Event</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          required
        />
        <select 
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="Individual">Individual Event</option>
          <option value="Group">Group Event</option>
        </select>
        {eventType === 'Group' && (
          <input
            type="number"
            value={numParticipants}
            onChange={(e) => setNumParticipants(e.target.value)}
            placeholder="Number of Participants"
            required
          />
        )}
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <textarea
          placeholder="Rules/Guidelines"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          required
        />

        {/* Image Selection Section */}
        <h3>Select an Image:</h3>
        <div className="image-selection">
          {images.map((img, index) => (
            <div key={index} className="image-option">
              <img 
                src={img} 
                alt={`Event Option ${index + 1}`} 
                className={`image-thumbnail ${image === img ? 'selected' : ''}`} 
                onClick={() => setImage(img)} 
              />
            </div>
          ))}
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
