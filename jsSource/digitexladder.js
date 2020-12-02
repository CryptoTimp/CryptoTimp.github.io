var grid = GridStack.init();

var bidAmount
var bidPrice
var askAmount
var askPrice

var distance = 10000
var consolidation = 1
var centrePrice = 0

var lastPrice

var msg1 = {
    "id": 1,
    "method": "subscribe",
    "params": [
        "BTCUSD1-PERP@orderbook_full"
    ]
}

var mark

// var msg3 = {
//     "id": 1,
//     "method": "subscribe",
//     "params": [
//         "BTCUSD1-PERP@ticker"
//     ]
// }

// var ws3 = new WebSocket('wss://ws.mapi.digitexfutures.com');
// ws3.onmessage = function(e) {
//     try {
//         response = JSON.parse(e.data)
//         console.log(e.data)
//     } catch (error) { response = e.data }
//     ws3.send("pong")
// };
// ws3.onopen = function() {
//     ws3.send(JSON.stringify(msg3));
// };

var consolidatedBids = {}
var consolidatedAsks = {}

var ws1 = new WebSocket('wss://ws.mapi.digitexfutures.com');
ws1.onmessage = function(e) {
    try {
        response = JSON.parse(e.data)
            //console.log(e.data)
    } catch (error) { response = e.data }
    try {

        mark = (response.data.bids[0][0])
        for (var i in response.data.bids) {
            bidPrice = (response.data.bids[i][0])
            bidAmount = (response.data.bids[i][1])

            consolidatedBids[bidPrice] = bidAmount
                //console.log(bidPrice, bidAmount)
        }

        for (var i in response.data.asks) {

            askPrice = (response.data.asks[i][0])
            askAmount = (response.data.asks[i][1])

            consolidatedAsks[askPrice] = askAmount
                //console.log(askPrice, askAmount)
        }

        try {
            if (centrePrice == 0) {
                centrePrice = mark
            }
        } catch (error) {}

    } catch (error) {}
    ws1.send("pong")


};
ws1.onopen = function() {
    ws1.send(JSON.stringify(msg1));
};




var msg2 = {
    "id": 1,
    "method": "subscribe",
    "params": [
        "BTCUSD1-PERP@trades"
    ]
}

var price

var rawprice
var lastPriceQTY

var ws2 = new WebSocket('wss://ws.mapi.digitexfutures.com');
ws2.onmessage = function(e) {
    try {
        response = JSON.parse(e.data)
            //console.log(e.data)
    } catch (error) { response = e.data }

    try {
        lastPriceQTY = (response.data.trades[0].qty)
        rawprice = (response.data.trades[0].px)
            // lastPrice = (response.data.trades[0].px)
        price = Number(response.data.trades[0].px);
    } catch (error) { console.log(error) }

    ws2.send("pong")
};
ws2.onopen = function() {
    ws2.send(JSON.stringify(msg2));
};


function resetDistance() {
    centrePrice = Math.round(Number(mark) / consolidation) * consolidation;
}
setInterval(resetDistance, distance)

function consolidate(price) {
    return parseInt(price / consolidation) * consolidation
}

function renderProcess() {
    let html = `<table>`
    html += `<tr><th colspan="1"></th><th colspan="1">Bids</th><th colspan="1">DigiTex</th><th colspan="1">Asks</th><th colspan="1"></th></tr>`
    for (var i = centrePrice + 50; i > centrePrice - 50; i -= consolidation) {
        try {
            lastPrice = mark
        } catch (error) { mark }
        if (consolidate(lastPrice) == i) {
            if (lastPrice > rawprice) {
                var directionColour = "green"
            } else {
                var directionColour = "red"
            }
            if (i in consolidatedBids) {
                // BEST BID
                html += `<tr><td></td>`
                html += `<td class=bestBidCol2 onclick="BinanceFBuy(${i})">${consolidatedBids[i]}</td>`
                html += `<td class=bestBidCol3>${i}</td>`
                html += `<td class=bestBidCol4 onclick="BinanceFSell(${i})"></td>`
                html += `<td id="centerPrice" style="background-color:${directionColour}; color:white;">${lastPriceQTY}</td>`

            } else if (i in consolidatedAsks) {
                html += `<tr><td></td>`
                html += `<td class=bestAskCol2 onclick="BinanceFBuy(${i})"></td>`
                html += `<td class=bestAskCol3>${i}</td>`
                html += `<td class=bestAskCol4 onclick="BinanceFSell(${i})">${consolidatedAsks[i]}</td>`
                html += `<td id="centerPrice" style="background-color:${directionColour}; color:white;">${lastPriceQTY}</td>`
            } else {
                // No bids/asks
                html += `<tr>
                        <td></td>
                        <td></td>
                        <td class=bestNBACol2></td>
                        <td class=bestNBACol3">${i}</td>
                        <td class=bestNBACol4></td>
                        <td></td>
                        </tr>`
            }
            // console.log(consolidatedBids)
        } else {
            if (i in consolidatedAsks && i > mark) {
                // BIDS


                html += `<tr><td></td>`
                html += `<td class=askCol2 onclick="BinanceFBuy(${i})"></td>`
                html += `<td class=askCol3>${i}</td>`
                html += `<td class=askCol4 onclick="BinanceFSell(${i})">${consolidatedAsks[i]}</td>`
                html += `<td></td></tr>`

            } else
            if (i in consolidatedBids && i < mark) {
                // ASKS
                html += `<tr><td></td>`
                html += `<td class=bidCol2 onclick="BinanceFBuy(${i})">${consolidatedBids[i]}</td>`
                html += `<td class=bidCol3>${i}</td>`
                html += `<td class=bidCol4 onclick="BinanceFSell(${i})"></td>`
                html += `<td></td></tr>`

            } else {
                // No bids/asks
                html += `<tr><td></td>`
                html += `<td class=NBACol2 onclick="BinanceFBuy(${i})"></td>`
                html += `<td class=NBACol3>${i}</td>`
                html += `<td class=NBACol4 onclick="BinanceFSell(${i})"></td>
            <td></td>
            </tr>`
            }
        }
    }
    html += '</table>'
    document.getElementById("GUI").innerHTML = html;
}
setInterval(renderProcess, 100)