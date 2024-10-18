import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dates, setDates] = useState([]);
  const [maxTemperatures, setMaxTemperatures] = useState([]);
  const [minTemperatures, setMinTemperatures] = useState([]);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [numDays, setNumDays] = useState(0);
  const [ranges, setRanges] = useState([]);
  const [date, setDate] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchAPIData = async () => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&start_date=2024-10-01&end_date=2024-10-20&daily=temperature_2m_max,temperature_2m_min&timezone=America/Chicago&temperature_unit=fahrenheit');
      const data = await response.json();

      setDates(data.daily.time);
      setMaxTemperatures(data.daily.temperature_2m_max);
      setMinTemperatures(data.daily.temperature_2m_min);
      setNumDays(data.daily.time.length);

      const maxTemp = Math.max(...data.daily.temperature_2m_max);
      const minTemp = Math.min(...data.daily.temperature_2m_min);
      setMax(maxTemp);
      setMin(minTemp);

      const rangeList = data.daily.temperature_2m_max.map((item, index) => (
        Math.round(item - data.daily.temperature_2m_min[index])
      ));
      setRanges(rangeList);
    };

    fetchAPIData();
  }, []);

  // Filter results based on date and temperature range
  useEffect(() => {
    const filteredData = dates.reduce((acc, currentDate, index) => {
      const isDateMatch = currentDate === date || date === '';
      const isRangeMatch = (
        (maxTemperatures[index] >= 50 && maxTemperatures[index] <= 70) ||
        (maxTemperatures[index] >= 70 && maxTemperatures[index] <= 90) ||
        (maxTemperatures[index] >= 90 && maxTemperatures[index] <= 100)
      );

      if (isDateMatch && isRangeMatch) {
        acc.push({
          date: currentDate,
          max: maxTemperatures[index],
          min: minTemperatures[index],
          range: ranges[index],
        });
      }
      return acc;
    }, []);
    
    setFilteredResults(filteredData);
  }, [dates, maxTemperatures, minTemperatures, ranges, date]);

  return (
    <div className='app'>
      <div className='menu'>
        <h1 className='title'>☁️Weather.io</h1>
        <h2 className='dashboard-button'>🏠 Dashboard</h2>
      </div>

      <div className='main'>
        <div className='summarization'>
          <div className='max-temp'>
            <h1 className="max-temp-value">🔥{max} °F</h1>
            <h2 className='max-temp-title'>Max Temperature</h2>
          </div>
          <div className='min-temp'>
            <h1 className="min-temp-value">🍂{min} °F</h1>
            <h2>Min Temperature</h2>
          </div>
          <div className='num-days'>
            <h1 className="num-days-val">{numDays}</h1>
            <h2>Number of Days</h2>
          </div>
        </div>

        <div className='dashboard'>
          <div className='filter'>
            <input
              type='text'
              placeholder='Enter Date (YYYY-MM-DD)'
              onChange={(e) => { setDate(e.target.value); }}
              className='search'
            />
            <div className="check-group">
              <label>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFilteredResults((prevResults) =>
                      prevResults.filter(result =>
                        isChecked ? (result.max >= 50 && result.max <= 70) : result
                      )
                    );
                  }}
                />
                50°F - 70°F
              </label>

              <label>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFilteredResults((prevResults) =>
                      prevResults.filter(result =>
                        isChecked ? (result.max >= 70 && result.max <= 90) : result
                      )
                    );
                  }}
                />
                70°F - 90°F
              </label>

              <label>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFilteredResults((prevResults) =>
                      prevResults.filter(result =>
                        isChecked ? (result.max >= 90 && result.max <= 100) : result
                      )
                    );
                  }}
                />
                90°F - 100°F
              </label>
            </div>
          </div>

          <table className='data'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Max Temperature (°F)</th>
                <th>Min Temperature (°F)</th>
                <th>Temperature Range (°F)</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.max}</td>
                  <td>{item.min}</td>
                  <td>{item.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
