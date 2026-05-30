// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('authToken');
    
    // Redirect to login or home page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="container mt-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h3 className="text-center">Logging out...</h3>
        </div>
      </div>
    </div>
  );
};

export default Logout;
