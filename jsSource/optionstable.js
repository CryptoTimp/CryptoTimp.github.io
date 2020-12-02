var grid = GridStack.init();
var msg = {
    "jsonrpc": "2.0",
    "method": "public/subscribe",
    "id": 42,
    "params": {
        "channels": ["markprice.options.btc_usd"]
    }
};

const Notiflix = require('notiflix')

// Create WebSocket connection.
const socket = new WebSocket('wss://fstream.binance.com/ws/btcusdt@trade');
// Connection opened
socket.addEventListener('open', function(event) {
    socket.send('Hello Server!');
});


const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);
// Listen for messages
var lastPrice = {}
socket.addEventListener('message', function(event) {

    const trade = JSON.parse(event.data);
    lastPrice = {
        price: trade.p,
        qty: trade.q,
        direction: trade.m
    }
});

var optionsObjectBids = {}
var optionsObjectAsks = {}

var distance = 10000
var consolidation = 250
var centrePrice = 15000

var ws = new WebSocket('wss://www.deribit.com/ws/api/v2');

ws.onmessage = function(e) {
    try {
        response = JSON.parse(e.data)

        for (var i in response.params.data) {

            if (Object.keys(response.params.data[i]).includes("synthetic_future")) {

                var synthetic_future_name1 = response.params.data[i].synthetic_future.instrument_name
                var synthetic_future_price = response.params.data[i].synthetic_future.mark_price

                if (Object.values(optionsObjectAsks).includes(synthetic_future_name1)) {
                    delete optionsObjectAsks[getKey(optionsObjectAsks, synthetic_future_name1)]
                } else if (Object.values(optionsObjectBids).includes(synthetic_future_name1)) {
                    delete optionsObjectBids[getKey(optionsObjectBids, synthetic_future_name1)]
                }

                if (Math.round(Number(synthetic_future_price)) > lastPrice.price) {
                    optionsObjectAsks[consolidate(Number(synthetic_future_price))] = synthetic_future_name1
                } else {
                    optionsObjectBids[consolidate(Number(synthetic_future_price))] = synthetic_future_name1
                }


            } else {
                var synthetic_future_name1 = "N/A"
                var synthetic_future_price_Object = "N/A"
            }
        };
        //console.log(optionsObjectBids)
        //console.log(optionsObjectAsks)
    } catch (error) {}




    let html = `<table>`
    html += `<tr><th colspan="3">Calls</th><th colspan="1"></th><th colspan="3">Puts</th></tr>`
    html += `<tr><th colspan="1">Name</th><th colspan="1">Mark</th><th colspan="1">IV</th><th colspan="1">BTC</th><th colspan="1">IV</th><th colspan="1">Mark</th><th colspan="1">Name</th></tr>`
    for (var i = centrePrice + 15000; i > centrePrice - 15000; i -= consolidation) {

        if (consolidate(lastPrice.price) == i) {

            if (i in optionsObjectBids) {

                html += `<tr><td></td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td style="background-color: lightblue;">${i}</td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td></td>`

            } else if (i in optionsObjectAsks) {

                html += `<tr><td></td>`
                html += `<td></td>`
                html += `<td ></td>`
                html += `<td style="background-color: lightblue;">${i}</td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td></td>`

            } else {
                // No bids/asks
                html += `<tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="background-color: lightblue;">${i}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>`
            }

        } else {

            if (i in optionsObjectBids && i < lastPrice.price) {


                html += `<tr><td></td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td class=bidCol3>${i}</td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td ></td>`

            } else if (i in optionsObjectAsks && i > lastPrice.price) {
                html += `<tr><td></td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td class=bidCol3>${i}</td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td ></td>`

            } else {
                // No bids/asks
                html += `<tr><td></td>`
                html += `<td></td>`
                html += `<td></td>`
                html += `<td class=NBACol3>${i}</td>`
                html += `<td></td>`
                html += `<td></td></tr>`
                console.log("end")
            }
        }
    }
    html += '</table>'
    document.getElementById("TABLE").innerHTML = html;


}

ws.onopen = function() {
    ws.send(JSON.stringify(msg));
};


function consolidate(price) {
    return parseInt(price / consolidation) * consolidation
}