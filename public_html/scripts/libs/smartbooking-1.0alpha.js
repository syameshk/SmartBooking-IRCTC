/* 
 * Author : Syamesh K
 * Do not use this source without author's permission
 * Started : 25-04-2016
 */

if ("undefined" === typeof jQuery)
    throw new Error("smart booking requires jQuery");
//http://youmightnotneedjquery.com/


(function (window) {
    'use strict';
    function define_Library() {
        var SB = {};
        var name = "Smart Booking";
        var users;

        var tempRouteResult;
        $.getJSON("data/temp/routes.json", function (json) {
            tempRouteResult = json;
            console.log(tempRouteResult);
        });
        function findValidRoutes(data,info) {
            console.log(data);
        };

        SB.greet = function () {
            console.log("Hello from the " + name + " library.");
        };
        SB.getRoute = function (info, callback) {
            console.log(info);
            $.ajax({type: "GET",
                crossOrigin: true,
                url: "http://api.railwayapi.com/route/train/12555/apikey/vkrev5917/",
                success: function (result) {
                    console.log(result);
                    result = tempRouteResult;
                    callback(result);
                    if (result.error) {
                        throw new Error("Invalid response from the server");
                    } else {
                        var routes = findValidRoutes(result.route,info);
                        //loop through and find availability
                    }
                }});
        };
        return SB;
    }
    //define globally if it doesn't already exist
    if (typeof (SB) === 'undefined') {
        window.SB = define_Library();
    }
    else {
        console.log("Library already defined.");
    }
})(window);

