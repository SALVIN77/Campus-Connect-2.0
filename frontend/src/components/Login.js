import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';  
import logo from './assets/logo2.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userId', res.data.user._id); 
      window.location.href = res.data.user.role === 'admin' ? '/register' : '/events'; // Redirect to the events page/register after login
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  useEffect(() => {
    document.title = "Campus Connect";
}, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
      <div className="logo">
        <img src={logo} alt="EduVents Logo" />
      </div>
        <h2>LOGIN</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button 
          type="button" 
          className="signup-button" 
          onClick={() => window.location.href = '/register'}>
          Signup
        </button>
      </form>
     
    </div>
  );
};

export default Login;
