import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const TemperatureChart = ({ dates , temperatures, name }) => {
    const [data, setData] = useState([])
    
    useEffect( () => {
        const getData = () =>{
            const formattedData = dates.map((date, index) => ({
                curr_date: date,
                Temperature: temperatures[index]
            }));
            setData(formattedData);
        }
        getData()
    }, [dates, temperatures]);

    return (
        <ResponsiveContainer width={310} height={200} className='chart'>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="curr_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey='Temperature' stroke="black" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperatureChart;