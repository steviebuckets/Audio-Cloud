$(document).ready(function() {
    $('form').submit(function(e) {
        e.preventDefault();
        getDataFromApi($('#inputSuccess5').val());
        $('header').hide();
        $('#results').show();


    });
});

//throttle  - 2 to 5s
//  keylisteners
/// "getting musicSearch in"
var musicSearch = "";
$("#user-search").keydown(function(event) {
    // deletion!!!
    // what is the delete key?
    // if (event.which == 8){
    // 	console.log('deleted');
    // 	musicSearch = $('#user-search').val();
    // 	console.log('after delete', musicSearch);
    // } else {
    musicSearch += String.fromCharCode(event.which);
    console.log(musicSearch, 'down');
    // }
    // 
    // console.log(musicSearch) // event.keyCode, etc... "letters"

}).keyup(function(event) {
    if (event.which == 8) {
        musicSearch = $('#user-search').val();
    }
    // console.log(musicSearch, 'up');
    // async, wait, or setTimeout
    // setTimeout(function() {
    // musicSearch = $('#user-search').val();
    
   // }, 3000);
});

function userMixcloudSearch() {
	var options = {
        data: []
    }
    $.getJSON("https://api.mixcloud.com/search/", { //old api "https://api.mixcloud.com/search?callback=?", {
            //are these the right parameters for the object?
            type: 'user',
            q: musicSearch
        })
        .done(function(response) {
           
                //var username = response.data[0].username;
                //var thumb = response.data[0].pictures.small;
                //var kind = response.data[0].name;      
            //console.log(username);

            var data = []
            for(var i=0; i <response.data.length; i++) {
            	data.push({name: response.data[i].username, icon: response.data[i].pictures.small});
            }
           
            var options = {
                data: data,
                getValue: "name",


                //[{ name: (username), type: (name), icon: (thumb) }],
                //getValue: "name",


                template: {
                    type: "custom",
                    method: function(value, item) {
                        return "<img src='" + item.icon + "' /> | " + value;
                    }
                }
            };

            // add name to the data array in the options objects (fancy terms)
            // hint: loop through the data in the response object.
            $("#user-search").easyAutocomplete(options);



        });

}


function getDataFromApi(query) {
    //is this the right callback function?

    // step 1: get the user
    $.getJSON("https://api.mixcloud.com/search?callback=?", {
            //are these the right parameters for the object?
            type: 'user',
            q: query
        })
        .done(
            function(response) {

                // only one user is returned (0 index)
                // pros: - very easy
                // cons: - lose the person you are looking for
                var username = response.data[0].username;
                // step 2: get the user's meta data
                $.getJSON("https://api.mixcloud.com/" + username + "?callback=?", {
                        metadata: "1"
                    })
                    .done(function(response) {
                        var url = response.metadata.connections.cloudcasts;
                        // step 3: gets the cloudcasts  
                        $.getJSON(url + "?callback=?", {
                                limit: 2
                            })
                            .done(function(response) {
                                displayAPIResults(response.data);
                            });
                    });

            });

}

/*var options = {
	data: [ {name: "username, type: "air", icon: "http://l},
		{name: username, type: "ground", icon: thumbnail},
		{name: username, type: "ground", icon: "http://lorempixel.com/100/50/transport/10"},
		{name: username, type: "air", icon: "http://lorempixel.com/100/50/transport/1"},
		{name: username, type: "ground", icon: "http://lorempixel.com/100/50/transport/6"}],


	getValue: "name",

	template: {
		type: "custom",
		method: function(value, item) {
			return "<img src='" + item.icon + "' /> | " + item.type + " | " + value;
		}
	}
};

$("#template-custom").easyAutocomplete(options);

*/
function displayAPIResults(uploads) {
    $('#results').empty();
    var html = "";

    $.each(uploads, function(i, upload) {
        var audioPlayer = "https://api.mixcloud.com/" + upload.key + "/embed-html";
        html = html + "<li>" + "<iframe width='100%' height='120%' style='color: rgb(58, 58, 61)' frameborder='0' src='" + audioPlayer + "'></iframe>" + "<li>"
    });
    $('#results').html(html);
}
