//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording
var BLOBS = [];

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record
var lt = document.querySelector("#low-time");
var ht = document.querySelector("#high-time");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var join = document.querySelector("#show");
var myform = document.forms.myForm;
var searchButton = document.querySelector("#search-button");
var VideoPlay = document.getElementById("videoFrame");
var para = document.getElementById("to-remove");

// playing video

navigator.clipboard.readText().then(cliptext => VideoPlay.setAttribute("src",cliptext),err => console.log(err));

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
join.addEventListener("click", showUrl);

// joining blobs ------------------------------------------------------

function ConcatenateBlobs(blobs, type, callback) {
	var buffers = [];

	var index = 0;

	function readAsArrayBuffer() {
		if (!blobs[index]) {
			return concatenateBuffers();
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			buffers.push(event.target.result);
			index++;
			readAsArrayBuffer();
		};
		reader.readAsArrayBuffer(blobs[index]);
	}

	readAsArrayBuffer();


	function audioLengthTo32Bit(n) {
		n = Math.floor(n);
		var b1 = n & 255;
		var b2 = (n >> 8) & 255;
		var b3 = (n >> 16) & 255;
		var b4 = (n >> 24) & 255;
	 
		return [b1, b2, b3, b4];
	}
	function concatenateBuffers() {
		var byteLength = 0;
		buffers.forEach(function(buffer) {
			byteLength += buffer.byteLength;
		});

		var tmp = new Uint8Array(byteLength);
		var lastOffset = 0;
		var newData;
		buffers.forEach(function(buffer) {
			if (type=='audio/wav' && lastOffset >  0) newData = new Uint8Array(buffer, 44);
			else newData = new Uint8Array(buffer);
			tmp.set(newData, lastOffset);
			lastOffset += newData.length;
		});
		if (type=='audio/wav') {
			tmp.set(audioLengthTo32Bit(lastOffset - 8), 4);
			tmp.set(audioLengthTo32Bit(lastOffset - 44), 40); // update audio length in the header
		}
		var blob = new Blob([tmp.buffer], {
			type: type
		});
		callback(blob);        
		
	}
}


function startRecording() {

	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		// //update the format 
		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

		const numb = Number(ht.value) * 1000 - Number(lt.value) * 1000 + 700;
    	setTimeout(stopRecording, numb);

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	
	BLOBS.push(blob);
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = myform.link.value;

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	// link.href = url;
	// link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	// link.innerHTML = "Download";

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(" "));

	// //add the save to disk link to li
	li.appendChild(link);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="#";
	// upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}

function showonscreen(bb) {
	var myurl = URL.createObjectURL(bb);
	var link2 = document.getElementById('ask');
	var filename2 = myform.link.value;
	link2.href = myurl;
	link2.download = filename2+".wav"; //download forces the browser to donwload the file using the  filename
	var par = document.querySelector('.paragraph');
	par.src = myurl;

}

function showUrl() {
	ConcatenateBlobs(BLOBS, "audio/wav", showonscreen);
}