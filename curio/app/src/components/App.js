import React from 'react';
// import { Recorder , myRecorder} from 'react-voice-recorder';
// import ReactPlayer from 'react-player/youtube'
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
