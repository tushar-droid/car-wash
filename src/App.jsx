/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
function App(){

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState('');
  const [error, setError] = useState(null);
  const [result_key, setResult_key] = useState('NOPE')
  const [timestamp, setTimestamp] = useState(null);
  const [conditions, setConditions] = useState('');
  const [loading, setLoading] = useState(true);
  const KEY = '7dd6ba41dd78da2d426c8602e5ec3c72';
  let are_temps_freezing = false;
  let is_snow_expected = false;
  let is_rain_expected = false;
  

  //FOR USER LOCATION
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    getWeather(crd.latitude, crd.longitude)
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }




  useEffect(() =>{
    if(navigator.geolocation){
      navigator.permissions
      .query({name: "geolocation"})
      .then(function(result){
        console.log(result);
        if(result.state ==="granted"){
          navigator.geolocation.getCurrentPosition(success, errors, options)
        }
        else if(result.state === "prompt"){
          navigator.geolocation.getCurrentPosition(success, errors, options)
        }
        else if (result.state ==="denied"){
          //TODO
          console.log("location access denied")
        }
      });
    }else{
      console.log("Geolocation is not supported by this browser")
    }
  }, [])




  const getWeather = async (lat, long) =>{
    setError(null)
    if(lat && long){
      console.log("----USING COORDS TO GET DATA---");
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${KEY}&units=metric`
      )
      .catch((error)=>{
        setError(error)
      });
      setLocation(res.data.city.name)
      return
      // setWeatherData(res.data)
    }
    else if(location){
      console.log('The location that the func received was: ', location)
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?appid=${KEY}&q=${location}&units=metric`
      )
      .catch((error) =>{
        console.log('The error was set while getting the weather')
        setError(error);
        setLoading(false);

      })
      setWeatherData(res.data)
      setLoading(false);
    }
  }



  useEffect(()=>{
    getWeather()
  },[location]);

  useEffect(() =>{
    if(weatherData.list){
      console.log(`second use effect prints:, `, weatherData.list[0].weather[0].id)
      for( const data in weatherData.list){
        // console.log('WEATHER CONDITIONS:', weatherData.list[data].weather[0].id)
        if(weatherData.list[data].weather[0].id >=200 && weatherData.list[data].weather[0].id <=535){
          is_rain_expected = true;
          if(timestamp!==null)
            setTimestamp(weatherData.list[data].dt_txt)
        }
        else if(weatherData.list[data].weather[0].id >= 600 && weatherData.list[data].weather[0].id <=622){
          is_snow_expected = true;
          if(timestamp!==null)
            setTimestamp(weatherData.list[data].dt_txt)
        }
        else if(weatherData.list[data].main.temp < -10){
          are_temps_freezing = true;
          if(timestamp!==null)
            setTimestamp(weatherData.list[data].dt_txt)
        }

      }
      if(are_temps_freezing || is_rain_expected || is_snow_expected){
        setResult_key('NOPE');
        if(are_temps_freezing && is_rain_expected && is_snow_expected){
          setConditions('freezing temps, snow and rain');
          return;
        }
        else if(are_temps_freezing && is_rain_expected){
          setConditions('freezing temps and rain');
          return;
        }
        else if(are_temps_freezing && is_snow_expected){
          setConditions("freezing temps and snow");
          return
        }
        else if(is_rain_expected && is_snow_expected){
          setConditions("Rain and snow ");
          return;
        }
        else if(are_temps_freezing){
          setConditions("Freezing temps ");
          return;
        }
        else if(is_rain_expected){
          setConditions("rain");
          return;
        }
        else if(is_snow_expected){
          setConditions("snow");
          return;
        }
      }
      else{
        setResult_key("GO AHEAD");
      }
    
      //200 - 535 is rain including rain, thunderstorm, drizzle
      //600 - 622 is snow
      //reference: https://openweathermap.org/weather-conditions
    }
  },[weatherData])

  // const inp = document.querySelector('.searchbar-txt')
  // inp.addEventListener("keypress", (e) =>{
  //   if(e.key ==="Enter"){
  //     setLocation(inp.value.trim())
  //   }
  // })
  const getLocation = (e) =>{
    if(e.key ==="Enter"){
      setLoading(true)
      const val = document.querySelector('.searchbar-txt').value.trim();
      setLocation(val)
    }
  }

  return(
    <>
      <div className='navbar'>
        <h1 className='heading'>Should I wash my car <br/>today?</h1>
        <div className='searchbar'>
          <img src='/search-icon.png' className='search-icon'/>
          <input type="text" className='searchbar-txt'onKeyDown={e => getLocation(e)}/>
        </div>
      </div>
      {loading? location===null ? <h1 className='loading-screen'>PLEASE PROVIDE LOCATION ACCESS OR SEARCH FOR YOUR LOCATION </h1> : <h1 className='loading-screen'>LOADING...</h1>: 
      <>
        <h1 className='location-name'>{location}</h1>  
        <div className='main-content'>
          {error? <h1 className='error-screen'>THERE WAS AN ERROR TRY AGAIN WITH A DIFFERENT LOCATION<br/> POSSIBLE REASONS CAN BE: <br/> &nbsp;&nbsp;&nbsp;&nbsp; - THE LOCATION YOU ENTERED WAS NOT FOUND IN OUR SERVER. <br/>&nbsp;&nbsp;&nbsp;&nbsp; - OUR SERVERS ARE DOWN</h1>:
          <>
            <div className="content-left">
              <h1 className={`header-key ${result_key==='GO AHEAD'?  'positive-result' : 'negative-result' }`}>{result_key}</h1>
              <h3>{result_key==="GO AHEAD" ? `Weather seems clear make that whip shine :)` :`not a great idea ${conditions} expected within next 5 days`}</h3>
              <p>{timestamp}</p>
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
            </>
          }
        </div>
      </>}
    </> 
  )
}




export default App





// EXAMPLE API CALL: https://api.openweathermap.org/data/2.5/forecast?appid=7dd6ba41dd78da2d426c8602e5ec3c72&q=kamloops
// q GIVES THE LOCATION TO THE PLACE 
// APP ID IS THE API KEY