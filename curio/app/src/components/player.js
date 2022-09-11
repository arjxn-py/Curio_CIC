import React from 'react'


const player = () => {

    function _(id){
		return document.getElementById(id);
	}
	function audioApp(){
		var audio = new Audio();
		var audio_index = 1;
		var is_playing = false;
		var playingtrack;
		var trackbox = _("trackbox");
		var tracks = {
			"track1":["Fast Lane", "fast_lane"],
			"track2":["Breathe", "breathe"],
			"track3":["Stranglehold", "stranglehold"]
		};
		for(var track in tracks){
			var tb = document.createElement("div");
			var pb = document.createElement("button");
			var tn = document.createElement("div");
			tb.className = "trackbar";
			pb.className = "playbutton";
			tn.className = "trackname";
			tn.innerHTML = audio_index+". "+tracks[track][0];
			pb.id = tracks[track][1];
			pb.addEventListener("click", switchTrack);
			tb.appendChild(pb);
			tb.appendChild(tn);
			trackbox.appendChild(tb);
			// var ap = document.createElement("audio");
			// trackbox.appendChild(ap)
			audio_index++;
		}
		audio.addEventListener("ended",function(){
			_(playingtrack).style.background = "url(images/play.png)";
			playingtrack = "";
			is_playing = false;
		});
	function switchTrack(event){
		if(is_playing){
		    if(playingtrack !== event.target.id){
			    is_playing = true;
				_(playingtrack).style.background = "url(images/play.png)";
			    event.target.style.background = "url(images/pause.png)";
				audio.src = `audio/${playingtrack}.mp3`
	            audio.play();
			} else {
			    audio.pause();
			    is_playing = false;
				event.target.style.background = "url(images/play.png)";
			}
		} else {
			is_playing = true;
			event.target.style.background = "url(images/pause.png)";
			if(playingtrack !== event.target.id){
                audio.play();
				audio.src = `audio/${playingtrack}.mp3`
			}
		}
		playingtrack = event.target.id;
	}
}
window.addEventListener("load", audioApp);

    return (
        <>
         <div id="trackbox">
            <audio src=''></audio>
         </div>
        </>
    )
}

export default player;
