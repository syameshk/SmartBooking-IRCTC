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

    var route

    var result = [];


    $("#search_submit").click(function (e) {
        e.preventDefault();
        var travelInfo = {trainno:$("#trainnumber").val(),travelfrom: $("#travelfrom").val(),travelto: $("#travelto").val(),traveldate: $("#traveldate").val(),includerac: $("#includerac").is(':checked'), class:"Sleeper(SL)"};
        SB.getRoute(travelInfo,route_callback);
    });

    function route_callback(data) {
        if(data.error){
            console.log("Something went wrong!");
            console.log(data.error);
        }else{
            console.log("Train route fetched, please wait while we find availability!");
            console.log("This might take some time!");
        }
    }
    
    function availability_callback(data,percentage) {
        //Add data to available array
        //Add to table
        console.log("Finding availability, Complition status :"+percentage);
    }
    
    function availability_fail(data) {
        console.log(data);
    }
});
