import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const Dogs = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dogsPerPage] = useState(5);
  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = props.dogs.slice(indexOfFirstDog, indexOfLastDog);
  const totalPages = Math.ceil(props.dogs.length / dogsPerPage);
  const [favorites, setFavorites] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [match, setMatch] = React.useState({});
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFavorite = (dog) => {
    const isFavorite = favorites.some(favDog => favDog === dog);
    if (!isFavorite) {
      setFavorites([...favorites, dog]); 
    } else {
      setFavorites(favorites.filter(favDog => favDog !== dog));
    }
  };

  const findMatch = async () => {
    if(favorites.length===0)  {
      alert('Please select some favorites first to find your match!');
    } else {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', { 
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(favorites)
        });
  
        if (response.ok) {
            const match = await response.json();
            handleOpen(match)
          } else {
            console.error('Login failed.');
          }
        } catch (error) {
          console.error('An error occurred during login:', error);
        }
    }
  };

  const handleOpen = async (e) => {
    const matchedDog = await props.dogs.filter(dog => dog.id === e.match);
    setMatch(matchedDog[0])
    setOpen(true)  
  };

    return (
      <div id="dogsWrapper">
        {currentDogs.map((dog) => (
          <div className="dogDiv">
            <img className="dogImg" src={dog.img}/>
            <h1>{dog.name}</h1>
            <p>Age: {dog.age}</p>
            <p>Location: {dog.zip_code}</p>
            <p>Breed: {dog.breed}</p>
            <Button onClick={() => toggleFavorite(dog.id)}>
                {favorites.some(favDog => favDog === dog.id) ? '★' : '☆'} {/* Use a star icon to represent favorite status */}
            </Button>
          </div>
      ))}
        <div >
          {Array.from({ length: totalPages }, (_, i) => (
            <Button className="pagination" key={i + 1} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </div>
        <Button id="matchButton" onClick={findMatch}type="submit" variant="contained">
            Find me a match!
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          id="matchModal"
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Meet your new BFF!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <img className="dogImg" src={match.img}/>
            <h2>{match.name}</h2>
            <p>Age: {match.age}</p>
            <p>Location: {match.zip_code}</p>
            <p>Breed: {match.breed}</p>
          </Typography>
        </Box>
      </Modal>
      </div>
    );
};

export default Dogs;