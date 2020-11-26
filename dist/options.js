(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var grid = GridStack.init();
var msg = {
    "jsonrpc": "2.0",
    "method": "public/subscribe",
    "id": 42,
    "params": {
        "channels": ["markprice.options.btc_usd"]
    }
};
var ws = new WebSocket('wss://www.deribit.com/ws/api/v2');



$("#search").on("keyup", function() {
    var value = $(this).val();

    $("table tr").each(function(index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:first").text();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            } else {
                $row.show();
            }
        }
    });
})



ws.onmessage = function(e) {
    // do something with the notifications...
    response = JSON.parse(e.data)
    console.log(response.params.data)
    console.log(response.params.data[0].synthetic_future.instrument_name)
    var deribitoptions = ""
    deribitoptions += "<table>"
    deribitoptions += "<th>Instrument_Name</th><th>Synthetic Future</th><th>Synthetic Price</th><th>Mark_Price</th><th>IV</th>"

    //console.log(response.params.data)
    for (var i in response.params.data) {
        if (Object.keys(response.params.data[i]).includes("synthetic_future")) {
            var synthetic_future_name = response.params.data[i].synthetic_future.instrument_name
            var synthetic_future_price = response.params.data[i].synthetic_future.mark_price
        } else {
            var synthetic_future_name = "N/A"
            var synthetic_future_price = "N/A"
        }
        deribitoptions += `<tr><td style="color:white;">${response.params.data[i].instrument_name}</td><td style="color:white;">${synthetic_future_name}</td><td style="color:white;">${synthetic_future_price}</td><td style="color:white;">${response.params.data[i].mark_price}</td><td style="color:white;">${response.params.data[i].iv}</td></tr>`

    }

    deribitoptions += "</table>"
    document.getElementById("DeribitOptions").innerHTML = deribitoptions;
};
ws.onopen = function() {
    ws.send(JSON.stringify(msg));
};
},{}]},{},[1]);
