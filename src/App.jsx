import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [dates, setDates] = useState(null);
  const [data, setDate] = useState('');
  const [maxTemperatures, setMaxTemperatures] = useState(null);
  const [minTemperatures, setMinTemperatures] = useState(null);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [numDays, setNumDays] = useState(0);

  useEffect(() => {
    const fetchAPIData = async() => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&start_date=2024-10-01&end_date=2024-10-20&daily=temperature_2m_max,temperature_2m_min&timezone=America/Chicago&temperature_unit=fahrenheit');
      const data = await response.json();

      setDates(data.daily.time);
      setMaxTemperatures(data.daily.temperature_2m_max);
      setMinTemperatures(data.daily.temperature_2m_min);
      
      setMax(Math.max(...maxTemperatures));
      setMin(Math.min(...minTemperatures));
      setNumDays(data.daily.time.length);
    };
    fetchAPIData();
  }, []);

  return (
    <div className='app'>
    
      <div className='menu'>
        <h1 className='title'>☁️Weather.io</h1>
        <h2 className='dashboard-button'>🏠 Dashboard</h2>
      </div>

      <div className='main'>

        <div className='summarization'>

          <div className='max-temp'>
            <h1 class="max-temp-value">🔥{max} °F</h1>
            <h2 className='max-temp-title'>Max Temperature</h2>
          </div>

          <div className='min-temp'>
            <h1 class="min-temp-value">🍂{min} °F</h1>
            <h2>Min Temperature</h2>
          </div>

          <div className='num-days'>
            <h1 class="num-days-val">{numDays}</h1>
            <h2>Number of Days</h2>
          </div>
        </div>

        <div className='dashboard'>
          <input type='text' placeHolder='Enter Date' onChange={(e) => {setDate(e.target.value)}}/>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Max Temperature (°F)</th>
                <th>Min Temperature (°F)</th>
              </tr>
            </thead>
            <tbody>
          
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default App
