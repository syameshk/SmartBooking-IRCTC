/* 
 * Author : Syamesh K
 * Do not use this source without author's permission
 * Started : 25-04-2016
 */

if ("undefined" === typeof jQuery)
    throw new Error("smart booking requires jQuery");
//http://youmightnotneedjquery.com/

SmartBooking = function (default_callback, route_callback, availability_callback, availability_fail) {
    var scope = this;
    var name = "Smart Booking";
    var users;
    var apikey = "Xeugvo5917";
    var tempRouteResult;
    var tempAvailability;
    var step = 1;
    var route = [];
    var validRoutes = [];
    var availability = [];
    var successCount = 0;
    var failCount = 0;
    var default_callback = default_callback;
    var route_callback = route_callback;
    var availability_callback = availability_callback;
    var availability_fail = availability_fail;
    var totalDistance;

    $.getJSON("data/temp/routes.json", function (json) {
        tempRouteResult = json;
    });

    $.getJSON("data/temp/availability.json", function (json) {
        tempAvailability = json;
    });

    $.getJSON("data/private/users.json", function (json) {
        users = json;
    });

    function apiKeySelector() {
        var key = "Not Available";
        for(var  i = 0 ;i<users.length;i++){
            if(users[i].current_hit < users[i].max_hit ){
                users[i].current_hit++;
                key = users[i].userkey;
                break;
            }
        }
        return key;
    }

    function seatAvailabilitySuccess(data) {
        var distance = scope.findDistance(data.from.code,data.to.code)
        var current = {train_number: data.train_number, from: data.from.name, to: data.to.name, class: data.class.class_name, availability: data.availability[0].status, date: data.availability[0].date, quote: data.quota.quota_name, distance:distance, totalDistance: totalDistance};
        availability.push(current);
        //Add the details to an array list
        successCount++;
        var percentage = (successCount / validRoutes.length) * 100;
        //console.log("Success "+percentage);

        //Callback to send message
        availability_callback(current, percentage);
    }

    function seatAvailabilityFail(data) {
        //Try again?
        failCount++;
        var percentage = (failCount / validRoutes.length) * 100;
        //console.log("Fail "+percentage);

        //Callback to send message
        availability_fail(data, percentage);
    }

    function findIndex(arr, propName, propValue) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                return i;
    }

    function findValidRoutes(routes, info) {
        // Starting station index from route date
        var startIndex = findIndex(routes, "code", info.travelfrom);
        // Destination station index from route date
        var endIndex = findIndex(routes, "code", info.travelto);
        // Array to store, valid routes
        var foundRoutes = [];
        console.log(startIndex + " to " + endIndex + " of" + routes.length);

        // Check and find all valid routes
        //validRoutes.push({source:"CODE",dest:"CODE"});
        if (startIndex == "undefined" || endIndex == "undefined") {
            console.log("Not coudn't find the source/destination in the route!");
        } else {
            totalDistance = scope.findDistance(routes[startIndex].code,routes[endIndex].code);
            console.log("Total travel distance :"+totalDistance);
            //Note: This part need to be improvised
            for (var i = 0; i < endIndex; i++) {
                for (var j = startIndex + step + i; j < routes.length; j++) {
                    foundRoutes.push({source: routes[i], dest: routes[j]});
                }
            }
            //console.log(foundRoutes);
            return foundRoutes;
        }
    }

    function findAllAvailability(info, routes) {
        for (var i = 0; i < routes.length; i++) {
            var data = {trainno: info.trainno, date: info.traveldate, class: info.class, quota: info.quota, source: routes[i].source.code, dest: routes[i].dest.code};
            findSeatAvailability(data, seatAvailabilitySuccess, seatAvailabilityFail);
        }
    }


    // This method will check the availability, and gives a result
    // http://api.railwayapi.com/check_seat/train/<train number>/source/<source code>/dest/<dest code>/date/<doj in DD-MM-YYYY>/class/<class code>/quota/<quota code>/apikey/<apikey>/
    function findSeatAvailability(data, successcallback, errorcallback) {
        var url = "http://api.railwayapi.com/check_seat/train/" + data.trainno + "/source/" + data.source + "/dest/" + data.dest + "/date/" + data.date + "/class/" + data.class + "/quota/" + data.quota + "/apikey/" + apiKeySelector() + "/";
        //console.log("url : " + url);
        $.ajax({
            type: "GET",
            crossOrigin: true,
            url: url,
            success: function (result) {
                //console.log(result);
                if (result.error) {
                    //successcallback(tempAvailability);
                    errorcallback(result);
                } else {
                    successcallback(result);
                }
            }});
    }

    this.greet = function () {
        console.log("Hello from the " + name + " library.");
    };

    this.findDistance = function (source, dest) {
        var distance = -1;
        if (route != "undefined") {
            var startIndex = findIndex(route, "code", source);
            var destIndex = findIndex(route, "code", dest);
            if (startIndex == "undefined" || destIndex == "undefined") {
                console.log("Not coudn't find the source/destination in the route!");
            } else {
                distance = route[destIndex].distance - route[startIndex].distance;
            }
        }
        return distance;
    };

    this.getRoute = function (info, callback) {
        console.log(info);
        $.ajax({type: "GET",
            crossOrigin: true,
            url: "http://api.railwayapi.com/route/train/" + info.trainno + "/apikey/" + apiKeySelector() + "/",
            success: function (result) {
                console.log(result);
                callback(result);
                if (result.error) {
                    throw new Error("Invalid response from the server");
                } else {
                    route = result.route;
                    validRoutes = findValidRoutes(result.route, info);
                    if (validRoutes != "undefined") {
                        route_callback(validRoutes);
                        findAllAvailability(info, validRoutes);
                    }
                }
            }});
    };
};

