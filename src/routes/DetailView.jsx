import { useState, useEffect } from 'react';
import { Link, useParams} from 'react-router-dom';

const DetailView = ({weatherData}) => {
    const { date } = useParams(); // Get the date from the URL
    const [weatherDetail, setWeatherDetail] = useState(null);
    const [condition, setCondition] = useState('');
    useEffect(() => {
        const detail = weatherData.find(item => item.date === date);
        setWeatherDetail(detail);

        if (detail.weatherCode === 0) {
            setCondition('Clear Sky☀️');
        }
        else if (detail.weatherCode == 1)
        {
            setCondition('Mainly Clear🌤️');
        }
        else if (detail.weatherCode == 2)
        {
            setCondition('Partly Cloudy⛅');
        }
        else if (detail.weatherCode == 3)
        {
            setCondition('Overcast☁️');
        }
    }, [date, weatherData]);

    if (!weatherDetail) return <div className='loading'>Loading...</div>;

    return (
        <div className='app'>
            <div className='menu'>
                <h1 className='title'>☁️Weather.io</h1>
                <nav>
                    <Link to="/" className='dashboard-button'>🏠 Dashboard</Link>
                </nav>
            </div>

            <div className='details'>
                <h3 className='info'>Date: {weatherDetail.date}</h3>
                <h3 className='info'>Wind Speed: {weatherDetail.windSpeed} m/s</h3>
                <h3 className='info'>Precipitation: {weatherDetail.precipitation} mm</h3>
                <h3 className='info'>Weather Condition: {condition}</h3>
                <h3 className='info'>Humidity: {weatherDetail.humidity}%</h3>
                <h3 className='info'>UV Index: {weatherDetail.uvIndex}</h3>
                <h3 className='info'>Description: Here, we have specific details on the weather on '{weatherDetail.date}' other than temperature.</h3>
            </div>
        </div>
    )
}

export default DetailView;