import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', { 
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email })
        });
  
        if (response.ok) {
            navigate('/'); 
          } else {
            console.error('Login failed.');
          }
        } catch (error) {
          console.error('An error occurred during login:', error);
          setError('Login failed.')
        }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <p>{error}</p>
      </form>
    );
};

export default Login;