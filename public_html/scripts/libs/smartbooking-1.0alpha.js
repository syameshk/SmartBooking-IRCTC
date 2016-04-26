/* 
 * Author : Syamesh K
 * Do not use this source without author's permission
 * Started : 25-04-2016
 */

if ("undefined" === typeof jQuery)
    throw new Error("smart booking requires jQuery");
//http://youmightnotneedjquery.com/

SmartBooking = function () {
    var name = "Smart Booking";
    var users;
    var apikey = "Xeugvo5917";
    var tempRouteResult;
    var tempAvailability;
    var step = 3;
    var validRoutes = [];

    $.getJSON("data/temp/routes.json", function (json) {
        tempRouteResult = json;
    });
    
    $.getJSON("data/temp/availability.json", function (json) {
        tempAvailability = json;
    });

    $.getJSON("data/users.json", function (json) {
        users = json;
    });

    function apiKeySelector() {
        return "Xeugvo5917";
    }

    function seatAvailabilitySuccess(data) {
        //Add the details to an array list
    }

    function seatAvailabilityFail(data) {
        //Try again?
    }

    function findIndex(arr, propName, propValue) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                return i;
    }
    function findValidRoutes(data, info) {
        var startIndex = findIndex(data, "code", info.travelfrom);
        var endIndex = findIndex(data, "code", info.travelto);
        validRoutes = [];
        console.log(startIndex + " to " + endIndex+" of"+data.length);
        //validRoutes.push({source:"CODE",dest:"CODE"});
        if (startIndex == "undefined" || endIndex == "undefined") {
            console.log("Not coudn't find the source/destination in the route!");
        } else {
            //Note: This part need to be improvised
            for (var i = 0; i < endIndex; i++) {
                for (var j = startIndex + step + i; j < data.length; j++) {
                    validRoutes.push({source: data[i].code, dest: data[j].code});
                }
            }
//            
//            
//            for(var i = 0 ;i < startIndex ; i++){
//                for(var j = startIndex+1+i;j<data.length;j++){
//                    validRoutes.push({source:data[i].code,dest:data[j].code});
//                }
//            }
//            for(var i = startIndex; i < endIndex; i++){
//                for(var j = startIndex+1+i;j<data.length;j++){
//                    validRoutes.push({source:data[i].code,dest:data[j].code});
//                }
//            }
            console.log(validRoutes);
            return validRoutes;
        }
    }
    
    
    
    // This method will check the availability, and gives a result
    // http://api.railwayapi.com/check_seat/train/<train number>/source/<source code>/dest/<dest code>/date/<doj in DD-MM-YYYY>/class/<class code>/quota/<quota code>/apikey/<apikey>/
    function findSeatAvailability(data, successcallback, errorcallback) {
        var url = "http://api.railwayapi.com/check_seat/train/" + data.trainno + "/source/" + data.source + "/dest/" + data.dest + "/date/" + data.date + "/class/" + data.class + "/quota/" + data.quota + "/apikey/" + apiKeySelector() + "/";
        console.log("url : " + url);
        $.ajax({
            type: "GET",
            crossOrigin: true,
            url: url,
            success: function (result) {
                console.log(result);
                if (result.error) {
                    errorcallback(data);
                } else {
                    successcallback(result);
                }
            }});
    }

    this.greet = function () {
        console.log("Hello from the " + name + " library.");
    };

    this.getRoute = function (info, callback) {
        console.log(info);
        $.ajax({type: "GET",
            crossOrigin: true,
            url: "http://api.railwayapi.com/route/train/" + info.trainno + "/apikey/" + apikey + "/",
            success: function (result) {
                console.log(result);
                result = tempRouteResult;
                callback(result);
                if (result.error) {
                    throw new Error("Invalid response from the server");
                } else {
                    var routes = findValidRoutes(result.route, info);
                    //loop through and find availability
                }
            }});
    };
};


//(function (window) {
//    'use strict';
//    function define_Library() {
//
//
//
//        var SB = {};
//        var name = "Smart Booking";
//        var users;
//        var apikey = "Xeugvo5917";
//        var tempRouteResult;
//
//
//        $.getJSON("data/temp/routes.json", function (json) {
//            tempRouteResult = json;
//        });
//
//        $.getJSON("data/temp/users.json", function (json) {
//            users = json;
//        });
//
//        function findIndex(arr, propName, propValue) {
//            for (var i = 0; i < arr.length; i++)
//                if (arr[i][propName] == propValue)
//                    return i;
//        }
//        function findValidRoutes(data, info) {
//            var startIndex = findIndex(data, "code", info.travelfrom);
//            var endIndex = findIndex(data, "code", info.travelto);
//            console.log(startIndex + " " + endIndex);
//            console.log(data);
//        }
//
//
//
//
//        function apiKeySelector() {
//            return "Xeugvo5917";
//        }
//
//        SB.greet = function () {
//            console.log("Hello from the " + name + " library.");
//        };
//        SB.getRoute = function (info, callback) {
//            console.log(info);
//            $.ajax({type: "GET",
//                crossOrigin: true,
//                url: "http://api.railwayapi.com/route/train/" + info.trainno + "/apikey/" + apikey + "/",
//                success: function (result) {
//                    console.log(result);
//                    result = tempRouteResult;
//                    callback(result);
//                    if (result.error) {
//                        throw new Error("Invalid response from the server");
//                    } else {
//                        var routes = findValidRoutes(result.route, info);
//                        //loop through and find availability
//                    }
//                }});
//        };
//        return SB;
//    }
//    //define globally if it doesn't already exist
//    if (typeof (SB) === 'undefined') {
//        window.SB = define_Library();
//    }
//    else {
//        console.log("Library already defined.");
//    }
//})(window);

