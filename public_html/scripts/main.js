/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    
    //Get the user data
    var users;
    $.getJSON("data/users.json", function (json) {
        users = json;
    });
    //Get the station data
    var stations;
    $.getJSON("data/stations.json", function (json) {
        stations = json;
    });
    //Get the train data
    var trains;
    $.getJSON("data/trains.json", function (json) {
        trains = json;
    });
    
    
    $("#search_submit").click(function (e) {
        e.preventDefault();
        
        var apikey = users[0].userkey;
        var trainno = $("#trainnumber").val();;
        var travelfrom = $("#travelfrom").val();
        var travelto = $("#travelto").val();
        var traveldate = $("#traveldate").val();
        var includerac = $("#includerac").val();
        
        console.log(apikey);console.log(trainno);console.log(travelfrom);console.log(travelto);console.log(traveldate);console.log(includerac);
        
        var url = "http://api.railwayapi.com/route/train/"+trainno+"/apikey/"+apikey+"/"
        console.log(url);
        $.ajax({type: "GET",
            crossOrigin: true,
            url: "http://api.railwayapi.com/route/train/12555/apikey/vkrev5917/",
            success: function (result) {
                console.log(result);
            }});
    });
});
