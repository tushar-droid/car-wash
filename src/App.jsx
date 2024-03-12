import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
function App(){

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState('delhi');
  const [weatherData, setWeatherData] = useState('');

  const result_key = 'NOPE';
  const result_result = 'NOT A GREAT IDEA SNOW EXPECTED WITHIN NEXT 5 DAYS!!';
  const KEY = '7dd6ba41dd78da2d426c8602e5ec3c72';


  useEffect(()=>{
    const getWeather = async () =>{
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?appid=${KEY}&q=${location}&units=metric`
      )
      setWeatherData(res.data)
    }
    getWeather()
  },[]);





  return(
    <>
    <div className='navbar'>
      <h1 className='heading'>Should I wash my car <br/>today?</h1>
      <div className='searchbar'>
        <img src='../public/search-icon.png' className='search-icon'/>
        <input type="text" className='searchbar-txt'/>
      </div>
    </div>  
    <div className='main-content'>
      <div className="content-left">
        <h1 className={`header-key ${result_key==='YES'?  'positive-result' : 'negative-result' }`}>{result_key}</h1>
        <h3>{result_result}</h3>
      </div>
      <div className="content-right">
        
        <h2>CURRENT WEATHER CONDITIONS</h2>
        <div className='weather-top'>
          <img src={ weatherData.list? `https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`: '' }/>
          <h1>{weatherData.list ? weatherData.list[0].main.temp : 'NA'}° C</h1>
        </div>
        <div className="weather-bottom">
          <h1>{weatherData.list ? 'Conditions: ' + weatherData.list[0].weather[0].main + ''  : 'loading'}</h1>
          <hr />
          <h1>{weatherData.list ? 'Precipitaion Probability: ' + weatherData.list[0].pop + ''  : 'loading'}</h1>
        </div>
      </div>
    </div>
    </>
  )
}




export default App





// EXAMPLE API CALL: https://api.openweathermap.org/data/2.5/forecast?appid=7dd6ba41dd78da2d426c8602e5ec3c72&q=kamloops
// q GIVES THE LOCATION TO THE PLACE 
// APP ID IS THE API KEY