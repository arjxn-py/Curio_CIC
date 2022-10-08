var searchBut = document.querySelector("#search-button");
var vdo = document.querySelector("#view-video");
var ado = document.querySelector("#listen-video");
var sp = document.querySelector("#sath-play");
var ss = document.querySelector("#sath-stop");
var myform = document.forms.myForm;


navigator.clipboard.readText().then(cliptext => vdo.setAttribute("src",cliptext),err => console.log(err));


searchBut.onclick = function () {
    vdo.setAttribute("src", ids[0]+"?enablejsapi=1&version=3&playerapiid=ytplayer");
    var att = myform.link.value;
    var att2 = 'audio/';
    for (var i = 0; i < att.length; i++) {
        if (att[i] === '/') {
            att2 = att2 + '_';
        }
        else if (att[i] === ':') {
            att2 = att2 + '_';
        }
        else {
            att2 = att2 + att[i];
        }
    }
    ado.setAttribute("src", att2 + ".wav");
}

sp.onclick = function() {
    vdo.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
    ado.play();
}

ss.onclick = function() {
    vdo.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    ado.pause();
}
