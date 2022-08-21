import React from 'react';
import ReactPlayer from 'react-player/youtube'
import './App.css'

function App() {
  return (
    <div className="App">
    <ReactPlayer controls url= 'https://youtu.be/0e3GPea1Tyg' />
    </div>
  );
}

export default App;
