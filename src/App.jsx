import { useState, useEffect } from 'react';
import Dashboard from "./routes/Dashboard";
import DetailView from './routes/DetailView';
import NotFound from './routes/NotFound'
import { useRoutes } from "react-router-dom";
import './App.css';

function App() {

  const [weatherData, setWeatherData] = useState([]);

  // Fetch weather data and set it in state
  useEffect(() => {
    const fetchAPIData = async () => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&start_date=2024-10-01&end_date=2024-10-20&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode,relative_humidity_2m_max,uv_index_max&timezone=America/Chicago&temperature_unit=fahrenheit');
      const data = await response.json();

      // Structure the data for details page
      const formattedData = data.daily.time.map((date, index) => ({
        date,
        precipitation: data.daily.precipitation_sum[index],
        windSpeed: data.daily.windspeed_10m_max[index],
        weatherCode: data.daily.weathercode[index],
        humidity: data.daily.relative_humidity_2m_max[index],
        uvIndex: data.daily.uv_index_max[index],
      }));

      setWeatherData(formattedData);
    };

    fetchAPIData();
  }, []);


  const routes = useRoutes([
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/:date',  // Dynamic route for the date
        element: <DetailView weatherData={weatherData} />
      },
      {
        path:"*",
        element: <NotFound />
      }
    ])
  return (
    <div>
      {routes}
    </div>
  )
}

export default App;
