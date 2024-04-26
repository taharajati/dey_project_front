import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...props }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const response = await fetch('http://188.121.99.245/api/auth/get_user', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (response.ok) {
            // Token is valid, allow access
            setLoading(false);
          } else {
            // Token is not valid, redirect to login page
            navigate('/login');
          }
        } catch (error) {
          // Error occurred while validating token, redirect to login page
          console.error('Error checking token validity:', error);
          navigate('/login');
        }
      } else {
        // No token found, redirect to login page
        navigate('/login');
      }
    };

    checkTokenValidity();
  }, [navigate]);

  return loading ? null : element;
};

export default ProtectedRoute;
