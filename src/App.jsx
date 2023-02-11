import { useState, useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import './App.css';

function App() {

  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => country);
        setCountries(countries);
      });
  }, []);

  const sendRequest = () => {
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()));
    setFilteredCountries(filteredCountries);
  }

  const ref = useRef(sendRequest);

  useEffect(() => {
    ref.current = sendRequest;
  }, [value]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    }
    return debounce(func, 1000);
  }, []);

  const onChange = (e) => {
    const value = e.target.value;
    setValue(value);
    debouncedCallback();
  };

  return (
    <div className="App">
      <div className="App-container">
        <input className='App-input' type="text" onChange={onChange} value={value} placeholder="Search for a country name..."/>
        <div className='App-results'>
          <ul>
            {filteredCountries.map(country => {
              const { flags, name } = country;
              return (
                <li key={country}>
                  <a>
                    <img src={flags.png} alt={flags.alt} />
                    <h1>{name.common}</h1>
                    <p>{country?.capital?.[0]}</p>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;