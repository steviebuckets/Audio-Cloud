/* this should hide the search input on submit and display the results section with embedded player */
$(document).ready(function() {
    $('form').submit(function(e) {
        e.preventDefault();
        getDataFromApi($('#inputSuccess5').val());
        $('header').hide();
        $('#results').show();
    });
});

/*this logs the keydown in the input form and returns the value to the form */
/*this also assigns a minimum value to the char before the callback/searc to api data begins */
var musicSearch = "";
$("#user-search").keydown(function(event) {

    if (musicSearch.length > 3) {
        userMixcloudSearch();
        musicSearch += String.fromCharCode(event.which);
    }

    /*this logs the keydown in the input form if the user hits the delete key/*
    /*after the delete keydown is logged it refreshes the value in the input form to refelect the new string*/
}).keyup(function(event) {
    if (event.which == 8) {
        musicSearch = $('#user-search').val();
    }
    //userMixcloudSearch();
});

/*Callback execution, when function is invoked input value from search is now processed and searched*/
function userMixcloudSearch() {
    var options = {
            data: []
        }
        /*API callback and URL, gets user DATA*/
    $.getJSON("https://api.mixcloud.com/search/", { //old api "https://api.mixcloud.com/search?callback=?", {
            type: 'user',
            q: musicSearch
        })
        .done(function(response) {

            var username = response.data[0].username;
            var thumb = response.data[0].pictures.small;
            var kind = response.data[0].name;
            console.log(username);

            var data = []
            for (var i = 0; i < response.data.length; i++) {
                data.push({ name: response.data[i].username, icon: response.data[i].pictures.small });
            }

            var options = {
                data: data,
                requestDelay: 200,
                getValue: "name",

                /*easyAutoComplete template for displaying data in input form*/
                template: {
                    type: "custom",
                    method: function(value, item) {
                        return "<img src='" + item.icon + "' />  " + value;
                    }
                }
            };

            /*input value from search sent to easyAutoComplete*/
            $("#user-search").easyAutocomplete(options);
        })

    }




    /*Original logic for searching API and displaying to DOM
    $.getJSON("https://api.mixcloud.com/search?callback=?", {
                //are these the right parameters for the object?
                type: 'user',
                q: query
            })
            .done(
                function(response) {

                    
                    var username = response.data[0].username;
                    
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

        function displayAPIResults(uploads) {
       $('#results').empty();
        var html = "";

        $.each(uploads, function(i, upload) {
        var audioPlayer = "https://api.mixcloud.com/" + upload.key + "/embed-html";
        html = html + "<li>" + "<iframe width='100%' height='120%' style='color: rgb(58, 58, 61)' frameborder='0' src='" + audioPlayer + "'></iframe>" + "<li>"
        });
      $('#results').html(html);
    */
