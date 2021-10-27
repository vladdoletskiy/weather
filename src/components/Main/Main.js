import React from 'react';
import { useState, useEffect } from 'react';
import style from './style.css'
import api from '../../api/api';
import dateBuilder from '../../date/dateBuilder';
import axios from 'axios';




export default function Main() {
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState({});   
    const [weather, setWeather] = useState({}); 
    const [latitude, setLatitude] = useState(); 
    const [longitude, setLongitude] = useState(); 
    const [hide, setHide] = useState(true); 
    const axios = require('axios');


// Получаем геолокацию
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
  
    function success(pos) {
        let crd = pos.coords;
        setLatitude(crd.latitude);
        setLongitude(crd.longitude);
    };
  
    function locerror(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };
  
// Получаем геолокацию по клику
    function getLocation() {
        navigator.geolocation.getCurrentPosition(success, locerror, options); 
        console.log(latitude);
        console.log(longitude); 
    }




// Запрос на сервер - получаем название города
    useEffect( () => {
    if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined')  {
          axios.get(`https://app.geocodeapi.io/api/v1/reverse?apikey=738fefd0-370a-11ec-b456-e7b851b5072f&point.lat=${latitude}&point.lon=${longitude}`) 
     .then(response =>
        {
          const city = response.data;
          setLocation(city);
       
        })
        .catch(error => {
            console.error('Error fatching data: ', error);
             setError(error);
        })
    }
   
   }, [latitude, longitude])



    let startCity;
    if (Object.keys(location).length !== 0  ) {
    startCity = location?.features?.[0].properties.region;
    console.log('city', startCity); 
    }



// Получаем дынные о погоде - если есть изначальное название города
    useEffect( () => {
        if (typeof startCity !== 'undefined') {
            fetch(`${api.base}weather?q=${startCity}&units=metric&appid=${api.key}`)
            .then(response =>response.json())  
            .then(result => {
                setWeather(result);
                //  setQuery('');
                
            })
        }
    }, [startCity])

 // Получаем дынные о погоде - по клику
    const search = (event) => {
        if (event.key === 'Enter') {
            fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
            .then(response =>response.json())  
            .then(result => {
                setWeather(result);
                //  setQuery('');
            })
        }
    }



// стартовий цвет
    const startBG = {
        backgroundColor: 'rgb(0, 149, 255)',
    }

// функция для интерполяции цвета
    function colorInterpolation(start, end, step) {
        let one = (end - start) * step + start;
        return one
    }


// функция для изменения цвета в зависимости от температуры
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
                <div>
                <div className='location-request' style={(Object.keys(weather).length !== 0 || hide === false ) 
       ?  {display: 'none'} : {display: 'block'}}>
                    <p>Need yout location</p>
                    <button onClick={getLocation}>OK</button>
                    <button onClick={() => {
                                    setHide(false);
                    }}>NO</button>
                 </div>
            
       </div>
                   
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


