import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
function App(){

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState('Kelowna');
  const [weatherData, setWeatherData] = useState('');
  let are_temps_freezing = false;
  let is_snow_expected = false;
  let is_rain_expected = false;
  let time_stamp = '';

  let result_key = 'NOPE';
  // const result_result = 'NOT A GREAT IDEA SNOW EXPECTED WITHIN NEXT 5 DAYS!!';
  const KEY = '7dd6ba41dd78da2d426c8602e5ec3c72';
  let conditions = '';

  useEffect(()=>{
    const getWeather = async () =>{
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?appid=${KEY}&q=${location}&units=metric`
      )
      setWeatherData(res.data)
    }
    getWeather()
  },[location]);

  useEffect(() =>{
    if(weatherData.list){
      console.log(`second use effect prints:, `, weatherData.list[0].weather[0].id)
      for( const data in weatherData.list){
        // console.log('WEATHER CONDITIONS:', weatherData.list[data].weather[0].id)
        if(weatherData.list[data].weather[0].id >=200 && weatherData.list[data].weather[0].id <=535){
          is_rain_expected = true;
          time_stamp = weatherData.list[data].dt_txt;
        }
        else if(weatherData.list[data].weather[0].id >= 600 && weatherData.list[data].weather[0].id <=622){
          is_snow_expected = true;
          time_stamp = weatherData.list[data].dt_txt;
        }
        else if(weatherData.list[data].main.temp < -5){
          are_temps_freezing = true;
        }

      }

      console.log(`Are temps freezing: ${are_temps_freezing} | Is snow expected: ${is_snow_expected} | Is rain expected: ${is_rain_expected}`)
      console.log('TIME STAMP: ', time_stamp)
      if(are_temps_freezing || is_rain_expected || is_snow_expected){
        result_key = 'NOPE'
        if(are_temps_freezing && is_rain_expected && is_snow_expected){
          conditions = 'freezing temps, snow and rain';
          return;
        }
        else if(are_temps_freezing && is_rain_expected){
          conditions = 'freezing temps and rain';
          return;
        }
        else if(are_temps_freezing && is_snow_expected){
          conditions = "freezing temps and snow";
          return
        }
        else if(is_rain_expected && is_snow_expected){
          conditions = "Rain and snow ";
          return;
        }
        else if(are_temps_freezing){
          conditions = "Freezing temps ";
          return;
        }
        else if(is_rain_expected){
          conditions = "rain"
          return;
        }
        else if(is_snow_expected){
          conditions = "snow"
          return;
        }
      }
      else{
        result_key = "GO AHEAD"
      }
      



      // if(weatherData.list[0].weather[0].id >= 200 && weatherData.list[0].weather[0].id <=535 ){
      //   console.log("Rain is expected in the next few days");

      // }
      // if(weatherData.list[0].weather[0].id >= 600 && weatherData.list[0].weather[0].id <=622 ){
      //   console.log("Snow is expected in the next few days")
      // }
      //200 - 535 is rain including rain, thunderstorm, drizzle
      //600 - 622 is snow
      //reference: https://openweathermap.org/weather-conditions
    }
  },[weatherData])



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
        <h1 className={`header-key ${result_key==='GO AHEAD'?  'positive-result' : 'negative-result' }`}>{result_key}</h1>
        <h3>{result_key==="GO AHEAD" ? `Weather seems clear make that whip shine :)` :`not a great idea ${conditions} expected within next 5 days`}</h3>
        <p>{conditions}</p>
      </div>
      <div className="content-right">
        
        <h2>CURRENT WEATHER CONDITIONS</h2>
        <div className='weather-top'>
          <img src={ weatherData.list? `https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`: '' }/>
          <h1>{weatherData.list ? weatherData.list[0].main.temp : 'NA'}° C</h1>
        </div>
        <div className="weather-bottom">
          <h1 className='weather-conditions'>{weatherData.list ? 'Conditions: ' + weatherData.list[0].weather[0].main + ''  : 'loading'}</h1>
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