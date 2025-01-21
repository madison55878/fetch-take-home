import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/fetch-logo.gif'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';


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
            navigate('/search'); 
        } else {
          setError('Login failed.')
        }
        } catch (error) {
          setError('Login failed.')
        }
    };
  
    return (
    <div id="loginDiv">
      <img id="fetchLogo" src={logo} alt="Logo" />
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35%'}}>
          <TextField sx={{ margin: '5px 0'}} id="outlined-basic" label="Name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)} variant="outlined" />
          <TextField sx={{ margin: '5px 0'}} id="outlined-basic" label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} variant="outlined" />    
          <Button type="submit" variant="contained">
            Login
          </Button>     
        </FormControl>  
      </form>
      <p>{error}</p>
    </div>  
    );
};

export default Login;