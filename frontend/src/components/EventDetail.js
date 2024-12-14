import React, { useEffect, useState } from 'react'; // Import React and hooks
import axios from 'axios'; // Import Axios for making HTTP requests
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import './EventDetail.css'; // Import CSS for styling

const EventDetail = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null); // State to hold event details
  const [error, setError] = useState(''); // State to hold error messages
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [registerNumbers, setRegisterNumbers] = useState([]); // State to hold register numbers
  const [isRegistered, setIsRegistered] = useState(false); // State to track if user is registered
  const [userRole, setUserRole] = useState(''); // State to track user role

  useEffect(() => {
      document.title = "Campus Connect";
    const fetchEventDetail = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the auth token from localStorage
        const role = localStorage.getItem('role'); // Get the user role from localStorage
        setUserRole(role); // Set the user role state
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/events/details/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setEvent(response.data);
          setRegisterNumbers(new Array(response.data.numParticipants).fill("")); // Initialize register numbers based on participants
          
          // Check if the user is already registered
          const userId = localStorage.getItem('userId'); // Assuming you store the user ID in localStorage
          const userRegistered = response.data.registrations.some(registration => registration.user === userId);
          setIsRegistered(userRegistered);
        } else {
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (err) {
        setError('An error occurred while fetching the event details.');
        console.error(err);
      }
    };

    fetchEventDetail();
  }, [id]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/events/${id}/register`, {
        registerNumbers, // Send the register numbers array
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('Successfully registered for the event!');
        setShowModal(false); // Close the modal on success
        setIsRegistered(true); // Set the registration status to true
      } else {
        alert(`Failed to register: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while registering for the event.');
    }
  };

  const handleInputChange = (index, value) => {
    const updatedRegisterNumbers = [...registerNumbers];
    updatedRegisterNumbers[index] = value; // Update the specific register number field
    setRegisterNumbers(updatedRegisterNumbers);
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="event-detail-container">
      <img src={event.image} alt={event.title} className="event-detail-image" />
      <h1><strong>{event.title}</strong></h1>
      <p><strong>Club Name: </strong>{event.clubName}</p>
      <p><strong>Event Type: </strong>{event.eventType}</p>
      <p><strong>Number of Participants: </strong>{event.numParticipants}</p>
      <h3>Details:</h3>
      <p>{event.description}</p>
      <p><strong>Date of Event: </strong>{new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time: </strong>{event.time}</p>
      <p><strong>Venue: </strong>{event.location}</p>
      <p><strong>For Department: </strong>{event.department}</p>
      <h3>Rules/Guidelines:</h3>
      <p>{event.rules}</p>

      {/* Conditionally render the Register button based on role */}
      {userRole === 'student' && (
        isRegistered ? (
          <button className="registered-button" disabled>Registered</button>
        ) : (
          <button className="register-button" onClick={() => setShowModal(true)}>Register</button>
        )
      )}

      {/* Modal for Registration */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Register for Event</h2>
            <p>Please enter the register numbers for the {event.numParticipants} participants:</p>

            {registerNumbers.map((_, index) => (
              <div key={index} className="register-input-container">
                <label>Participant {index + 1} Register Number:</label>
                <input
                  className="registerfield"
                  type="text"
                  value={registerNumbers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  required
                />
              </div>
            ))}

            <button className="submit-register-button" onClick={handleRegister}>Submit Registration</button>
            <button className="close-modal-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
