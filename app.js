// Listeners, hide and show

$(document).ready(function() {
    $('form').submit(function(e) {
        console.log("hello");
        e.preventDefault();
        getDataFromApi($('#inputSuccess5').val());
        $('#results').show();
        $('.audio-widget').hide();
        $('.input-group').hide();


    });
})

//API Callback and logic//

function getDataFromApi(query) {
    //is this the right callback function?
    $.getJSON("https://api.mixcloud.com/search?callback=?", {
            //are these the right parameters for the object?
            type: 'user',
            q: query,


        })
        .done(function(data) {
            var username = data.data[0].username;
            $.getJSON("https://api.mixcloud.com/" + username + "?callback=?", {
                    metadata: "1"
                })
                .done(function(response) {
                    var url = response.metadata.connections.cloudcasts;
                    $.getJSON(url + "?callback=?", {
                            limit: 1

                        })
                        .done(function(response) {
                            displayAPIResults(response.data);
                        });
                })

        })

}

//Display API data to HTML and Audio Player//

function displayAPIResults(uploads) {
    $('#results').empty();
    var html = "";

    $.each(uploads, function(i, upload) {
        var audioPlayer = "https://api.mixcloud.com/" + upload.key + "/embed-html";
        html = html + "<li>" + "<iframe width='100%' height='120' frameborder='' src='" + audioPlayer + "' ></iframe>" + "<li>"
    });
    $('#results').html(html);
}
