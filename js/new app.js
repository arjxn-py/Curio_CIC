
$(document).ready(function () {

    var API_KEY = "AIzaSyCSIaZuGUSsLjZ5bbCS9G_nf32Cvvkek1M"
    var video = ''

    $("#form").submit(function (event) {
        event.preventDefault()

        var search = $("#search").val()

        videoSearch(API_KEY, search, 10)

    })


    // function sendVideo () {
    //     navigator.clipboard.writeText(abc.id).then(success => console.log("text copied"),err => console.log("error copying text"));
    //     window.location.href = "translate.html";
    // }

    function videoSearch(key, search, maxResults) {

        $("#videos").empty()
        
        $.get("https://www.googleapis.com/youtube/v3/search?key=" + key
            + "&type=video&part=snippet&maxResults=" + maxResults + "&q=" + search, function (data) {
                console.log(data)

                data.items.forEach(item => {
                    video = `<iframe class="vd" width="380" height="300" style = " padding-bottom: 50px" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
                                <button type="button" id="http://www.youtube.com/embed/${item.id.videoId}" class="translate-but" id="http://www.youtube.com/embed/${item.id.videoId}?mute=1" onclick="sendVideo(this)">TRANSLATE</button><button type="button" class="view-but" onclick="viewVideo(this)">WATCH</button>`
                    $("#videos").append(video)
                    
                });

            })

    }


})

