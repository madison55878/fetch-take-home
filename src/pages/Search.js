import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dogs from '../components/Dogs';
import logo from '../assets/fetch-logo.gif'

const Search = () => {
  const [data, setData] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [isBreedAsc, setIsBreedAsc] = useState(true);
  const [isAgeAsc, setIsAgeAsc] = useState(true);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    breeds: [],
    zipCodes: [],
    ageMin: 0,
    ageMax: 22, 
    size: 25,
    sort: 'breed:asc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(formData.ageMax < formData.ageMin) {
      alert('You cannot choose a max age lower than a min age.')
    } 
    else {
      const params = new URLSearchParams({ageMin: formData.ageMin, ageMax: formData.ageMax, size: formData.size, sort: formData.sort});
      formData.breeds.forEach(breed => params.append('breeds[]', breed));
      formData.zipCodes.forEach(zipCode => params.append('zipCodes[]', zipCode));
      try {
        const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`, {
            credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        if(jsonData.resultIds.length === 0) {
          alert('No results found :(')
        } else {
          fetchDogs(jsonData.resultIds);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
  }

  const fetchDogs = async (ids) => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
      });

      if (response.ok) {
        const jsonData = await response.json();
        setDogs(jsonData)
        } else {
            console.error('Login failed.');
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
      }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
          navigate('/login'); 
      }
      } catch (error) {
        console.log(error)
      }
  }

  const toggleBreedAsc = () => {
    if(!isBreedAsc) {
      dogs.sort((a, b) => a.breed.localeCompare(b.breed));
      setIsBreedAsc(true)
    } else {
      dogs.sort((a, b) => b.breed.localeCompare(a.breed));
      setIsBreedAsc(false)
    }
    ;
  };

  const toggleAgeAsc = () => {
    if(!isAgeAsc) {
      dogs.sort((a, b) => a.age - b.age); 
      setIsAgeAsc(true)
    } else {
      dogs.sort((a, b) => b.age - a.age); 
      setIsAgeAsc(false)
    }
    ;
  };

  return (
    <><a id="logoutLink" onClick={handleLogout}>LOGOUT</a>
    
    <div id="searchFormDiv">
      <img id="fetchLogo" src={logo} alt="Logo" />
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35%' }}>
          <Autocomplete
            multiple
            options={data}
            className="formInput"
            name="breeds"
            onChange={(event, newValue) => {
              setFormData(prevData => ({ ...prevData, breeds: newValue }));
            } }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Breed(s)" />
            )} />
          <Autocomplete
            multiple
            className="formInput"
            name="zipCodes"
            onChange={(event, newValue) => {
              setFormData(prevData => ({ ...prevData, zipCodes: newValue }));
            } }
            options={[]}
            defaultValue={[]}
            freeSolo
            renderTags={(value, getTagProps) => value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip variant="outlined" label={option} key={key} {...tagProps} />
              );
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Zip Code(s)" />
            )} />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Min Age</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              className="formInput"
              name="ageMin"
              value={formData.ageMin}
              label="Min Age"
              onChange={handleChange}
            >
              {Array.from({ length: 23 }, (_, i) => i + 0).map((number) => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Max Age</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              className="formInput"
              name="ageMax"
              value={formData.ageMax}
              label="Max Age"
              onChange={handleChange}
            >
              {Array.from({ length: 23 }, (_, i) => i + 0).map((number) => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Results to Display</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              className="formInput"
              name="size"
              value={formData.size}
              label="Results to Display"
              onChange={handleChange}
            >
              <MenuItem key="25" value={25}>
                25
              </MenuItem>
              <MenuItem key="50" value={50}>
                50
              </MenuItem>
              <MenuItem key="100" value={100}>
                100
              </MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">
            Find your pup!
          </Button>
        </FormControl>
      </form>
      {dogs.length > 0 ? (
        <div> 
          <Button onClick={() => toggleBreedAsc()}>
            Breed {isBreedAsc ? '↑' : '↓' } {/* Use a star icon to represent favorite status */}
          </Button>
          <Button onClick={() => toggleAgeAsc()}>
            Age {isAgeAsc ? '↑' : '↓' } {/* Use a star icon to represent favorite status */}
          </Button>
          <Dogs dogs={dogs} />
        </div>
      ) : (
        <></>
      )}
    </div></>
  );
};

export default Search;