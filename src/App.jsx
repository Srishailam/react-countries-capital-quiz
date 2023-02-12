import { useState, useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import './App.css';

function App() {

  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [continets, setContinets] = useState([]);
  const [selectedContinets, setSelectedContinets] = useState([]);

  useEffect(() => {
    setIsLoading(true)
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countries = data.filter(country => country.independent && country.unMember);
        const continentsData = countries.map(country => country?.continents?.[0])
        setContinets([...new Set([...continentsData])].sort())
        setCountries(countries);
        setIsLoading(false);
      });
  }, []);

  const sendRequest = () => {
    const filteredCountriesByQuery = countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()));
    const filteredCountriesByContinents = filteredCountriesByQuery.filter(country => selectedContinets.length === 0 ? true : selectedContinets.includes(country.continents[0]))
    setFilteredCountries(filteredCountriesByContinents);
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

  const handleChange = e => {
    const {value, name, checked} = e.target;

    if(checked){
      setSelectedContinets([...selectedContinets, value]);
    } else {
      setSelectedContinets([...selectedContinets.filter( e => e !== value)])
    }
  };

  useEffect(() => {
    sendRequest()
  }, [selectedContinets])


  if(isLoading){
    return 'Loading....'
  }


  return (
    <div className="App">
      <div className="App-container">
        <input className='App-input' type="text" onChange={onChange} value={value} placeholder="Search for a country name..."/>
        <div className='App-filters'>
          {
            continets.map(c => {
              return (
                <p key={c}>
                  <input type="checkbox" id={c} onChange={handleChange} value={c} name={c}/>
                  <label htmlFor={c}>{c}</label>
                </p>
              )
            })
          }
          {
            <p className='count'>{`Total:${filteredCountries.length}`}</p>
          }
        </div>
        <div className='App-results'>
          <ul>
            {filteredCountries.map(country => {
              const { flags, name } = country;
              return (
                <li key={country.name.common}>
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