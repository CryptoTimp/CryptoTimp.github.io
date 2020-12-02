var grid = GridStack.init();
var msg = {
    "jsonrpc": "2.0",
    "method": "public/subscribe",
    "id": 42,
    "params": {
        "channels": ["markprice.options.eth_usd"]
    }
};

// Create WebSocket connection.
const socket = new WebSocket('wss://fstream.binance.com/ws/ethusdt@trade');
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
var consolidation = 5
var centrePrice = 0

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
    html += `<tr><th colspan="1">Bids</th><th colspan="1">ETH</th><th colspan="1">Asks</th></tr>`
    for (var i = centrePrice + 500; i > centrePrice - 500; i -= consolidation) {

        if (consolidate(lastPrice.price) == i) {

            if (i in optionsObjectBids) {



                //QTY
                html += `<tr><td class=bestBidCol2>${optionsObjectBids[i]}</td>`


                //CENTER PRICES
                html += `<td class=bestBidCol3>${i}</td>`

                //QTY
                html += `<td class=bestBidCol4></td>`

            } else if (i in optionsObjectAsks) {


                //QTY
                html += `<tr><td class=bestAskCol2></td>`

                //CENTER PRICES
                html += `<td class=bestAskCol3>${i}</td>`

                //QTY

                html += `<td class=bestAskCol4>${optionsObjectAsks[i]}</td>`

            } else {
                // No bids/asks
                html += `<tr>

                        <td class=bestNBACol2></td>
                        <td class=bestBidCol3>${i}</td>
                        <td class=bestNBACol4></td>

                        </tr>`
            }

        } else {

            if (i in optionsObjectBids && i < lastPrice.price) {
                //QTY
                //console.log((optionsObjectBids))



                html += `<tr><td class=bidCol2>${optionsObjectBids[i]}</td>`


                //CENTER PRICES
                html += `<td class=bidCol3>${i}</td>`

                //QTY
                html += `<td class=bidCol4></td>`

            } else if (i in optionsObjectAsks && i > lastPrice.price) {


                //QTY
                html += `<tr><td class=askCol2></td>`

                //CENTER PRICES
                html += `<td class=askCol3>${i}</td>`

                //QTY

                html += `<td class=askCol4>${optionsObjectAsks[i]}</td>`

            } else {
                // No bids/asks
                html += `<tr>`
                html += `<td class=NBACol2 onclick="BinanceFBuy(${i})"></td>`
                html += `<td class=NBACol3>${i}</td>`
                html += `<td class=NBACol4 onclick="BinanceFSell(${i})"></td>

            </tr>`
                    //console.log("end")
            }
        }
    }
    html += '</table>'
        //console.log(html)
    document.getElementById("GUIETH").innerHTML = html;


}


ws.onopen = function() {
    ws.send(JSON.stringify(msg));
};











// document.getElementById("headerAccBids").innerHTML = sum(consolidatedBids).toFixed(0);
// document.getElementById("headerAccAsks").innerHTML = sum(consolidatedAsks).toFixed(0);

// ping = Number(Date.now())-Number(candleData.time)
// //console.log(ping)
// document.getElementById("ping").innerHTML = ping+"ms";



// function sum(obj) {
//     var sum = 0;
//     for (var el in obj) {
//       if (obj.hasOwnProperty(el)) {
//         sum += parseFloat(obj[el]);
//       }
//     }
//     return sum;
//   }

// function sendStats() {

//     console.log(localStorage.APIKEYSTORAGE)

//     //SEND HEADER STATS
//     // document.getElementById("headerLastPrice").innerHTML = lastPrice.price;
//     // document.getElementById("headerOpen").innerHTML = candleData.open;
//     document.getElementById("headerHigh").innerHTML = candleData.high;
//     document.getElementById("headerLow").innerHTML = candleData.low;
//     document.getElementById("headerVolume").innerHTML = candleData.vol;
//     // document.getElementById("timeLeft").innerHTML = timeleft;

//     if (percentageChange > 0) {
//         document.getElementById("headerPercentageChange").innerHTML = percentageChange + "% " + pointChange;
//         document.getElementById("headerPercentageChange").style.color = "limegreen"
//     } else {
//         document.getElementById("headerPercentageChange").innerHTML = percentageChange + "% " + pointChange;
//         document.getElementById("headerPercentageChange").style.color = "#D23830"
//     }

//     if (Amount < 0) {
//         document.getElementById("posSize").style.color = "red"
//     } else if (Amount > 0) {
//         document.getElementById("posSize").style.color = "blue"
//     } else if (Amount === 0.000) {
//         document.getElementById("posSize").style.color = "black"
//     }
//     document.getElementById('posSize').value = Amount;
//     document.getElementById('balance').innerHTML = Number(wallet).toFixed(2);
//     document.getElementById('bnb').innerHTML = Number(bnb).toFixed(2);
//     document.getElementById('urpl').innerHTML = Number(urpl).toFixed(2);
//     document.getElementById('urwb').innerHTML = Number(wallet + urpl).toFixed(2);
// }
// setInterval(sendStats, 500)

function consolidate(price) {
    return parseInt(price / consolidation) * consolidation
}

const { last } = require('lodash');
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: `2X6NwCa2uto2YSX0WSCKX1Xiyu2DzwzRd0AWA2M3YSyCHTVNAtDWearxekW7Eflt`,
    // APIKEY: localStorage.APIKEYSTORAGE,
    APISECRET: `A7O6GaCv2YhNNveoOpgrN5kpFVyPpNyLMuRrDAxKb0IfAlpIugiDq7eG6XDZhJxM`
        // APISECRET: localStorage.APISECRETSTORAGE
});


BinanceEntryPrice = 10000

// async function getBinancePositionStats() {

//     async function asyncCall() {
//         var response = (await binance.futuresPositionRisk());
//         const result = await resolveAfter2Seconds();
//         console.log(response.ETHUSDT)
//         Amount = response.ETHUSDT.positionAmt
//         Entry = (response.ETHUSDT.entryPrice)
//         BinanceEntryPrice = parseInt(Entry / consolidation) * consolidation
//         MarkPrice = Number(response.ETHUSDT.markPrice)
//         PNLP1 = Number(MarkPrice - BinanceEntryPrice).toFixed(1)
//         urpl = Number(response.ETHUSDT.unRealizedProfit)
//     }
//     asyncCall(); //
//     async function resolveAfter2Seconds() {
//         return new Promise(resolve => {
//             setTimeout(() => {
//                 resolve('Complete!');
//             }, 0);
//         });
//     }
// }
// setInterval(getBinancePositionStats, 1000)



//WEBSOCKETS




// Create WebSocket connection.
const socket1 = new WebSocket('wss://fstream.binance.com/ws/ethusdt@miniTicker');
// Connection opened
socket1.addEventListener('open', function(event) {
    socket1.send('Hello Server!');
});

var candleData = {}
socket1.addEventListener('message', function(event) {

    const miniTicker = JSON.parse(event.data);
    //console.log(miniTicker)
    candleData = {
        open: miniTicker.o,
        high: miniTicker.h,
        low: Number(miniTicker.l),
        vol: miniTicker.v,
        time: miniTicker.E
    }
});


var percentageChange
var pointChange
var numberTrades
    // Create WebSocket connection.
const socket2 = new WebSocket('wss://fstream.binance.com/ws/ethusdt@ticker');
// Connection opened
socket2.addEventListener('open', function(event) {
    socket2.send('Hello Server!');
});
socket2.addEventListener('message', function(event) {
    const Ticker = JSON.parse(event.data);
    //console.log(Ticker)
    percentageChange = Ticker.P
    pointChange = (Number(Ticker.p)).toFixed(0)
    numberTrades = Ticker.n
});




var volumeProfileObject = {} //   prices : qty (denoted in ETH)
var price
var rawprice


// Create WebSocket connection.
const socket3 = new WebSocket('wss://fstream.binance.com/ws/ethusdt@aggTrade');
// Connection opened
socket3.addEventListener('open', function(event) {
    socket3.send('Hello Server!');
});



socket3.addEventListener('message', function(event) {
    const message = JSON.parse(event.data); // parsing single-trade record
    //console.log(message)
    rawprice = message.p
    price = Math.round(Number(message.p) / consolidation) * consolidation;
    if (volumeProfileObject[price] == undefined) {
        volumeProfileObject[price] = Number(message.q)
    } else {
        volumeProfileObject[price] = (volumeProfileObject[price] + Number(message.q))
    }
    //console.log(volumeProfileObject)

    //calculate center price
    if (centrePrice == 0) {
        centrePrice = price
    }
})



function dimvalVP() {
    for (var j in volumeProfileObject) {
        if (volumeProfileObject[j] >= 150) {
            for (var i in volumeProfileObject) {
                volumeProfileObject[i] = volumeProfileObject[i] / 2
            }
        }
    }

}
setInterval(dimvalVP, 500)



function resetDistance() {
    centrePrice = Math.round(Number(rawprice) / consolidation) * consolidation;
    // Notiflix.Notify.Warning(`Recalculating Range`);
}
setInterval(resetDistance, distance)