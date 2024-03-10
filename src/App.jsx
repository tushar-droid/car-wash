import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
function App(){

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState('salmon arm');
  const [weatherData, setWeatherData] = useState('');
  const KEY = '7dd6ba41dd78da2d426c8602e5ec3c72';
  useEffect(()=>{
    const getWeather = async () =>{
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?appid=${KEY}&q=${location}`
      )
      setWeatherData(res.data);      
    }
    getWeather()
  },[location]);

  useEffect(() =>{

    if(typeof weatherData ==='object'){
      for(const data in weatherData.list){
        console.log(weatherData.list[data])
        //console.log(weatherData.list[data].weather[0])
      }
    }
  })




  return(
    <>
    <h1>Hello world</h1>
    </>
  )
}




export default App





// EXAMPLE API CALL: https://api.openweathermap.org/data/2.5/forecast?appid=7dd6ba41dd78da2d426c8602e5ec3c72&q=kamloops
// q GIVES THE LOCATION TO THE PLACE 
// APP ID IS THE API KEY