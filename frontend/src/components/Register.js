import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import logo from './assets/logo2.png'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');
  const [classInfo, setClassInfo] = useState('');  // For students
  const [registerNumber, setRegisterNumber] = useState('');  // For students
  const [clubName, setClubName] = useState('');  // For coordinators
  const [phoneNumber, setPhoneNumber] = useState('');  // For coordinators
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        email,
        password,
        role,
        department,
        phoneNumber
      };

      if (role === 'student') {
        data.class = classInfo;
        data.registerNumber = registerNumber;
      } else if (role === 'coordinator') {
        data.clubName = clubName;
      }

      await axios.post('http://localhost:5000/api/users/register', data);
      window.location.href = '/register';
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  useEffect(() => {
    document.title = "Campus Connect";
}, []);

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
      <img src={logo} alt="EduVents Logo" />
        <h1>SIGNUP</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="coordinator">Coordinator</option>
        </select>
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        {role === 'student' && (
          <>
            <input
              type="text"
              placeholder="Class"
              value={classInfo}
              onChange={(e) => setClassInfo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Register Number"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
            />
          </>
        )}
        {role === 'coordinator' && (
          <>
            <input
              type="text"
              placeholder="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;