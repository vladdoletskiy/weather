import React from 'react';
import { useState, useEffect } from 'react';
import style from './style.css'
import api from '../../api/api';
import dateBuilder from '../../date/dateBuilder';
import { usePosition } from 'use-position';
import axios from 'axios';



export default function Main() {
const [error, setError] = useState(null);
const [query, setQuery] = useState();
const [location, setLocation] = useState({});   
const [weather, setWeather] = useState({}); 
const axios = require('axios');

const watch = true;
const {
    latitude,
    longitude,
  } = usePosition(watch);




   useEffect( () => {
     axios.get(`https://app.geocodeapi.io/api/v1/reverse?apikey=a6495580-31d5-11ec-843c-f9d8ed3b80f1&point.lat=${latitude}&point.lon=${longitude}`) 
     .then(response =>
        {
          const city = response.data;
          setLocation(city);
       
        })
        .catch(error => {
            console.error('Error fatching data: ', error);
            setError(error);
        })
   }, [latitude, longitude])


let startCity;
startCity = location?.features?.[0].properties.region;
console.log(startCity);



  useEffect( () => {
    fetch(`${api.base}weather?q=${startCity}&units=metric&appid=${api.key}`)
        .then(response =>response.json())  
        .then(result => {
            setWeather(result);
            setQuery('');
            
        })
   }, [startCity])



const search = (event) => {
     if (event.key === 'Enter') {
        fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then(response =>response.json())  
        .then(result => {
            setWeather(result);
            setQuery('');
        })
    }
}

const startBG = {
    backgroundColor: 'rgb(110, 109, 143)',
}

// функция для интерполяции цвета
function colorInterpolation(start, end, step) {
    let one = (end - start) * step + start;
    return one
}



function changeBG() {
    let temp = weather.main.temp;
    let one;

    if ( temp <= -10 ) {
        one = 180;
    } else if (temp === 10) {
        one = 58;
    } else if (temp >= 30) {
        one = 33;
    } else if (temp > -10 && temp < 10) {
        one = colorInterpolation(58, 180, 0.75);
    } else if (temp > 10 && temp < 30) {
        one = colorInterpolation(33, 58, 0.75);
    }

    let backgroundColor = {
         backgroundColor:`hsl(${one}, 100%, 50%)`,
        }
    return backgroundColor;
}

    return (
        <>
            <div className= 'container' style={(typeof weather.main !== 'undefined') 
       ?  changeBG() : startBG}>
                <div className='search-box'>
                    <input onChange={event => setQuery(event.target.value)} 
                        value={query}
                        onKeyPress={search}
                        type="text" 
                        className='search-bar'
                        placeholder='Search...' 
                    />

                </div>

                {(typeof weather.main !== 'undefined') ? (

                <div> 
                    <div className='location-box'>
                        <p className='location'>{weather.name}, {weather.sys.country}</p>
                        <p className='date'>{dateBuilder(new Date())}</p>
                    </div>

                    <div className='weather-box'> 
                        <div className='weather'>
                                {weather.weather[0].main}
                        </div>
                        <img className='wether-icon' src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
                        
                        <div className='temp'>
                            {Math.round(weather.main.temp)}°C
                        </div>
                    </div> 
                </div>
                ) : ('')}
            </div>
        </>
    )
}


