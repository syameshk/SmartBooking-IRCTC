/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
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
        var SB = new SmartBooking(default_callback, route_callback, availability_callback, availability_fail);
        e.preventDefault();
        
        // Convert date
        var myDate = new Date($("#traveldate").val());
        var dateString = (myDate.getMonth() + 1) + "-" + myDate.getDate() + "-" + myDate.getFullYear();
        
        console.log("date :"+dateString );
        var travelInfo = {trainno:$("#trainnumber").val(),travelfrom: $("#travelfrom").val(),travelto: $("#travelto").val(),traveldate: dateString,includerac: $("#includerac").is(':checked'), class:"SL", quota:"GN"};
        SB.getRoute(travelInfo,route_callback);
    });
    
    function default_callback(data) {
        console.log(data);
    }

    function route_callback(data) {
        if(data.error){
            console.log("Something went wrong!");
            console.log(data.error);
        }else{
            console.log("Train route fetched, please wait while we find availability!");
            console.log("found alternative routes "+data.length);
            console.log("This might take some time!");
        }
    }
    
    function availability_callback(data,percentage) {
        //Add data to available array
        //Add to table
        //console.log("Finding availability, Complition status :"+percentage);
        //We need only confirm tickets, do filter here, and display
        var distanceCovered = (data.distance/data.totalDistance) * 100;
        var row = '<tr><td>'+data.train_number+""+'</td><td>'+data.from+'</td><td>'+data.to+'</td><td>'+data.distance+'</td><td>'+distanceCovered+'</td><td>'+data.availability+'</td></tr>';
        //console.log(data);
        $('#avail_list tr:last').after(row);
    }
    
    function availability_fail(data,percentage) {
        console.log("Finding availability faild, Failed status :"+percentage);
    }
    
});
