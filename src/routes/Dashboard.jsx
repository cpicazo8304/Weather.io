import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TemperatureChart from '../components/TemperatureChart'

function Dashboard() {
  const [dates, setDates] = useState([]);
  const [maxTemperatures, setMaxTemperatures] = useState([]);
  const [minTemperatures, setMinTemperatures] = useState([]);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [numDays, setNumDays] = useState(0);
  const [date, setDate] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [upperLimits, setUpperLimits] = useState([]);
  const [lowerLimits, setLowerLimits] = useState([]);

  useEffect(() => {
    const fetchAPIData = async () => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&start_date=2024-10-01&end_date=2024-10-20&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode,relative_humidity_2m_max,uv_index_max&timezone=America/Chicago&temperature_unit=fahrenheit');
      const data = await response.json();

      setDates(data.daily.time);
      setMaxTemperatures(data.daily.temperature_2m_max);
      setMinTemperatures(data.daily.temperature_2m_min);
      setNumDays(data.daily.time.length);
       
      const maxTemp = Math.max(...data.daily.temperature_2m_max);
      const minTemp = Math.min(...data.daily.temperature_2m_min);
      setMax(maxTemp);
      setMin(minTemp);
    };

    fetchAPIData();
  }, []);

  // Filter results based on date and temperature range
  useEffect(() => {
    const filteredData = dates.reduce((acc, currentDate, index) => {
      const isDateMatch = currentDate === date || date === ''; // either user inputted a date or no date

      const isRangeMatch = upperLimits.length === 0 && lowerLimits.length === 0 // return all data if no filters
        ? true
        : upperLimits.some((limit, i) =>
          (maxTemperatures[index] >= lowerLimits[i] && maxTemperatures[index] <= limit) ||
          (minTemperatures[index] >= lowerLimits[i] && minTemperatures[index] <= limit)
        );

      if (isDateMatch && isRangeMatch) {
        //  current record follows true for the filters, so include them in the records that will be shown
        acc.push({
          date: currentDate,
          max: maxTemperatures[index],
          min: minTemperatures[index]
        });
      }
      return acc;
    }, []);
    
    // update shown results
    setFilteredResults(filteredData);
  }, [dates, maxTemperatures, minTemperatures, upperLimits, lowerLimits, date]);

  return (
    <div className='app'>
      <div className='menu'>
        <h1 className='title'>☁️Weather.io</h1>
        <nav>
            <Link to="/" className='dashboard-button'>🏠 Dashboard</Link>
        </nav>
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

        <div className="information">
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
                        if (isChecked)
                        {
                        // set the lower and upper limits for the results to be filted by
                        // any temperature within these limits will show up in the dashboard
                        // remove the original temperatures where everything shows up so you can
                        // only have filtered results.
                        setLowerLimits((prevLimits) => [...prevLimits, 50]);
                        setUpperLimits((prevLimits) => [...prevLimits, 70]);
                        }
                        else
                        {
                        // remove these limits so that the result will not be filtered by them
                        setLowerLimits((prevLimits) => prevLimits.filter(item => item !== 50));
                        setUpperLimits((prevLimits) => prevLimits.filter(item => item !== 70));
                        }
                    }}
                    />
                    50°F - 70°F
                </label>

                <label>
                    <input
                    type='checkbox'
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked)
                        {
                        // set the lower and upper limits for the results to be filted by
                        // any temperature within these limits will show up in the dashboard
                        // remove the original temperatures where everything shows up so you can
                        // only have filtered results.
                        setLowerLimits((prevLimits) => [...prevLimits, 70]);
                        setUpperLimits((prevLimits) => [...prevLimits, 90]);
                        }
                        else
                        {
                        // remove these limits so that the result will not be filtered by them
                        setLowerLimits((prevLimits) => prevLimits.filter(item => item !== 70));
                        setUpperLimits((prevLimits) => prevLimits.filter(item => item !== 90));
                        }
                    }}
                    />
                    70°F - 90°F
                </label>

                <label>
                    <input
                    type='checkbox'
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked)
                        {
                        // set the lower and upper limits for the results to be filted by
                        // any temperature within these limits will show up in the dashboard
                        // remove the original temperatures where everything shows up so you can
                        // only have filtered results.
                        setLowerLimits((prevLimits) => [...prevLimits, 90]);
                        setUpperLimits((prevLimits) => [...prevLimits, 100]);
                        }
                        else
                        {
                        // remove these limits so that the result will not be filtered by them
                        setLowerLimits((prevLimits) => prevLimits.filter(item => item !== 90));
                        setUpperLimits((prevLimits) => prevLimits.filter(item => item !== 100));
                        }
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
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                {filteredResults.map((item, index) => (
                    <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.max}</td>
                    <td>{item.min}</td>
                    <td>
                        <Link to={`/${item.date}`} className='detail-link'>🔗</Link> {/* Link to DetailView */}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
            <div className='charts'>
                <div className='max-chart'>
                    <h4 className='max-chart-title'>Max Temperatures: </h4>
                    <TemperatureChart dates={dates}  temperatures={maxTemperatures} name="Max Temperature"/>
                </div>

                <div className='min-chart'>
                <h4 className='min-chart-title'>Min Temperatures: </h4>
                    <TemperatureChart dates={dates}  temperatures={minTemperatures} name="Min Temperature"/>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
