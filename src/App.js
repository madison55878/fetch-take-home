import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
  //           credentials: 'include'
  //       });
  //       if (response.ok) {
  //         setLoggedIn(true)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ loggedIn ? ( <Search /> ) : (<Navigate replace to={"/login"} />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;