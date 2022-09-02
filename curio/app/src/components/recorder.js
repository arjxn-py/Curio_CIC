import React , {Component} from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
export default class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isRecording: false,
        blobURL: '',
        isBlocked: false,
        isRecordingStp: false,
      }

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
   }

  componentDidMount(){
    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
     );

     navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }
 
  start(){
    if (this.state.isBlocked) {
      alert('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
    let duration = document.querySelector('input').value;
    setTimeout(this.stop , duration * 1000)
  }

  stop() {
    Mp3Recorder
      .stop()
      .getMp3()

      .then(([buffer , blob])=>{
        const blobURL = URL.createObjectURL(blob);

        let dataArray = [];
        dataArray.push(blobURL);
        console.log(dataArray);

        this.setState({ blobURL, isRecording: false });
        this.setState({ isRecordingStp: true });
        }).catch((e) => console.log(e));

  };

  getDuration () {
    let duration = document.querySelector('input').value;
    console.log(duration);
  }
  reset() {
      document.getElementsByTagName('audio')[0].src = '';
      this.setState({ isRecordingStp: false });
  };

  render() {

    return(
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

             <button id = "record" onClick={this.getDuration} className="shadow bg-purple-500 hover:bg-purple-400 hover:text-white focus:shadow-outline focus:outline-none text-gray-500 font-bold py-2 px-4 rounded" type="button">
               Set Timer
             </button>
           </div>
         </div>

        
         {this.isRecording ? <span>🛑🎙️  Not Recording</span> : <span>🎙️ Click Record to Start Recording</span>}

         <div className="md:flex md:items-center">
           <div className="md:w-1/3"></div>
           <div className="md:w-2/3">
             <button id = "record" onClick={this.start} disabled={this.state.isRecording} className="shadow bg-purple-500 hover:bg-purple-400 hover:text-white focus:shadow-outline focus:outline-none text-gray-500 font-bold py-2 px-4 rounded" type="button">
               Record
             </button>

             {/* <button id = "stop" onClick={this.stop} disabled={!this.state.isRecording} className="shadow bg-purple-500 hover:bg-purple-400 hover:text-white focus:shadow-outline focus:outline-none text-gray-500 font-bold py-2 px-4 rounded" type="button">
               Stop
             </button> */}

           </div>
         </div>

       </form>

     <div className="md:flex md:items-center">
        <div className="md:w-1/3">
          <div className="md:w-2/3">
           <audio src={this.state.blobURL} controls className="shadow bg-purple-500 hover:bg-purple-400 hover:text-white focus:shadow-outline focus:outline-none text-gray-500 font-bold py-2 px-4 rounded" type="audio">
             </audio>
          </div>
       </div>
      </div>

     </>
    );
  }
}