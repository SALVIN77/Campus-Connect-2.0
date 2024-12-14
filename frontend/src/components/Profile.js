import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import pen from './assets/pen-icon.png'; // Edit icon for profile picture
import defaultimg from './assets/default-profile.png'; // Default Image

const Profile = () => {
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // Fetch user details on component load
  useEffect(() => {
      document.title = "Campus Connect";
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setUser(res.data.user))
      .catch(err => console.error(err));
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle image upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/api/users/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update user state with the new profile image
      setUser({ ...user, profileImage: response.data.imagePath });
      setShowUpload(false); // Hide file input after upload
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className="profile-container">
      {user && (
        <div className="profile-info">
          <h2><b>PROFILE</b></h2>
          <div className="profile-image-container">
            <img
              src={user.profileImage ? `http://localhost:5000${user.profileImage}` : defaultimg} // Update to absolute URL
              alt="Profile"
              className="profile-image"
            />
            <div className="edit-icon" onClick={() => setShowUpload(!showUpload)}>
              <img src={pen} alt="Edit" />
            </div>
          </div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Department:</strong> {user.department}</p>
          {user.role === 'student' && (
            <>
              <p><strong>Class:</strong> {user.class}</p>
              <p><strong>Register Number:</strong> {user.registerNumber}</p>
            </>
          )}

          {user.role === 'coordinator' && (
            <>
              <p><strong>Club Name:</strong> {user.clubName}</p>
              <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            </>
          )}
          
          <p><strong>Email:</strong> {user.email}</p>

          {showUpload && (
            <div className="upload-section">
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;