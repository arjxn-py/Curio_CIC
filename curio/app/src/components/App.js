import React from 'react';
import Audio from './recorder'
import player from './player';


import './App.css'

function App () {
  return(
    <div>
    <Audio/>
    {player()}
    </div> 
  )
}

export default App;
