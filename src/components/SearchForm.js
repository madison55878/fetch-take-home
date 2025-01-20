import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const SearchForm = () => {
  const [data, setData] = useState([]);
  const [ids, setIds] = useState([]);
  const [formData, setFormData] = useState({
    breeds: [],
    zipCodes: [],
    ageMin: 1,
    ageMax: 22
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
    console.log(event.target)
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    console.log(formData)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const urlSearchParams = new URLSearchParams(formData);
    const queryParams = urlSearchParams.toString();
    try {
      const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search` , {
          credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      setIds(jsonData.resultIds);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  return (
    <div>
      <form id="searchForm" onSubmit={handleSubmit}>
        <h1>Filter to find your dog!</h1>
        <FormControl sx={{ width: '50%'}}>
        <Autocomplete
          multiple
          options={data}
          name="breeds"
          onChange={(event, newValue) => {
            setFormData(prevData => ({ ...prevData, breeds: newValue }));
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Breed(s)"
            />
          )}
      />
        <Autocomplete
          multiple
          name="zipCodes"
          onChange={(event, newValue) => {
            setFormData(prevData => ({ ...prevData, zipCodes: newValue }));
          }}          
          options={[]}
          defaultValue={[]}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip variant="outlined" label={option} key={key} {...tagProps} />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Zip Code(s)"
            />
          )}
      />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Min Age</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="ageMin" 
            value={formData.ageMin}
            label="Min Age"
            onChange={handleChange}
          >
            {Array.from({ length: 22 }, (_, i) => i + 1).map((number) => (
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
            name="ageMax"
            value={formData.ageMax}
            label="Max Age"
            onChange={handleChange}
          >
            {Array.from({ length: 22 }, (_, i) => i + 1).map((number) => (
              <MenuItem key={number} value={number}>
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          <Button type="submit" variant="contained">
            Find your pup!
          </Button> 
        </FormControl>      
      </form>
    </div>
  );
};

export default SearchForm;