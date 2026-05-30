// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      
      // Save the token in local storage
      localStorage.setItem('authToken', response.data.token);

      // Redirect to home page or another page
      navigate('/');
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else {
          errorMessage = error.response.data.message || 'An error occurred';
        }
        console.error('Login error response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Login error request:', error.request);
      } else {
        // Something else happened
        console.error('Login error message:', error.message);
      }
      setError(errorMessage);
    }
  }

  return (
    <div className="container mt-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleLogin} className="bg-light p-4 rounded shadow">
            <h3 className="mb-4">Login</h3>
            <div className="form-group mb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
