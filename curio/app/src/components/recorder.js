import React , {useState,useEffect} from 'react';
// import {Recorder} from 'react-voice-recorder'
// import 'react-voice-recorder/dist/index.css'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

export const Form = () => {

  const [isListening , setIsListening] = useState(false)

  useEffect(()=> {
    handleListen()
  }, [isListening])

  
  const handleListen = () => {
    if(isListening){
      mic.start()
      mic.onend = () => {
        console.log('Continue...');
        mic.start()
      }
    }else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic On Click');
      }
    }
  }

  mic.onstart = () => {
    console.log('Mics on')
  }

  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    console.log(transcript)
    mic.onerror = event => {
      console.log(event.error)
    }
  }


  return (
    <>
      <form className="w-full max-w-sm">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Enter Duration <br/> In Seconds
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="number" min={0} max={60} placeholder='1-60'/>
          </div>
        </div>

        {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button id = "record" onClick={() => {setIsListening(prevState => !prevState)}} className="shadow bg-purple-500 hover:bg-purple-400 hover:text-white focus:shadow-outline focus:outline-none text-gray-500 font-bold py-2 px-4 rounded" type="button">
              Record
            </button>
          </div>
        </div>
      </form>
    </>


    );
  }