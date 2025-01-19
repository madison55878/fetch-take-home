import React, {useEffect, useState} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const Search = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [breeds, setBreeds] = useState([])

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

  const handleBreedChange = (event, selectedBreeds) => {
    setBreeds(selectedBreeds)
    console.log(breeds)
  }

  // const onRemove = (selectedList, removedItem) => {
  //   console.log(selectedList, removedItem)
  // }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(formData);
  }

  return (
    <div>
      <form id="searchForm" onSubmit={handleSubmit}>
        <h1>Filter to find your dog!</h1>
        <Autocomplete
          multiple
          options={data}
          onChange={(event, newValue) => {
            setBreeds(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Breed(s)"
            />
          )}
      />
        <input 
          type="text" 
          placeholder="Zip Code(s)"
          value={formData.zipCodes || []}
          onChange={handleChange} 
        />
        <label>Min Age </label>
        <select id="dropdown" value={formData.minAge || 0} onChange={handleChange}>
          {Array.from({ length: 17 }, (_, i) => i + 1).map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <label>Max Age </label>
        <select placeholder="Min Age" id="dropdown" value={formData.maxAge || 17} onChange={handleChange}>
          {Array.from({ length: 17 }, (_, i) => i + 1).map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <input type="submit" />
      </form>
    </div>
  );
};

export default Search;