var _ = require('lodash')
var $ = require('jquery')

const path = require('path')


var limits = {}

var ping

GridStack.init();

const Notiflix = require('notiflix')

var Client = require('node-rest-client').Client;
var client = new Client();

var orderbook = {
    bids: {},
    asks: {}
}
var updates = 0
var lastUpdateId

var distance = 10000
var consolidation = 1
var sizeThreshold = 1000
class SocketClient {
    constructor(path, baseUrl) {
        this.baseUrl = baseUrl || 'wss://stream.binance.com/';
        this._path = path;
        this._createSocket();
        this._handlers = new Map();
    }

    _createSocket() {
        console.log(`${this.baseUrl}${this._path}`);

        // // Create WebSocket connection.
        // const socket = new WebSocket('ws://localhost:8080');

        // // Connection opened
        // socket.addEventListener('open', function(event) {
        //     socket.send('Hello Server!');
        // });

        // // Listen for messages
        // socket.addEventListener('message', function(event) {
        //     console.log('Message from server ', event.data);
        // });


        this._ws = new WebSocket(`${this.baseUrl}${this._path}`);

        this._ws.onopen = () => {
            console.log('Binance ws connected');
        };

        // this.addEventListener.on('pong', () => {
        //     // console.log('receieved pong from server');
        // });
        // this._ws.on('ping', () => {
        //     //console.log('==========receieved ping from server');
        //     this._ws.pong();
        // });

        // this._ws.onclose = () => {
        //     console.log('ws closed');
        // };

        // this._ws.onerror = (err) => {
        //     console.log('ws error', err);
        // };

        this._ws.onmessage = (msg) => {
            try {
                const message = JSON.parse(msg.data);
                //console.log(message)
                //check for orderbook, if empty retrieve snapshot
                if (Object.keys(orderbook.bids).length == 0) {
                    // @ts-ignore
                    client.get('https://fapi.binance.com/fapi/v1/depth?symbol=COMPUSDT&limit=100',
                        function(data) {

                            for (var i in data.bids) {
                                var price = String(data.bids[i][0])
                                var qty = Number(data.bids[i][1])
                                orderbook.bids[price] = qty
                            }
                            for (var j in data.asks) {
                                var price = String(data.asks[j][0])
                                var qty = Number(data.asks[j][1])
                                orderbook.asks[price] = qty
                            }
                            orderbook.lastUpdateId = data.lastUpdateId
                            console.log(data)
                        })
                }

                //get lastUpdateId
                else {
                    //console.log(orderbook.bids)
                    lastUpdateId = Number(orderbook.lastUpdateId)
                        //console.log(message.U, message.u, lastUpdateId)
                        //console.log(message.u)
                    if (updates == 0) {
                        if (message.U <= lastUpdateId && message.u >= lastUpdateId) {
                            updates++
                            //console.log('process this update')
                            orderbook.lastUpdateId = message.u
                            processUpdates(message)

                        } else {
                            console.log('discard this update', (message.U <= lastUpdateId), (message.u >=
                                lastUpdateId))
                            orderbook.lastUpdateId = message.u
                        }
                    } else if (message.pu == lastUpdateId) {
                        //console.log('process this update')
                        orderbook.lastUpdateId = message.u
                        processUpdates(message)
                    } else {
                        console.log('Out of sync, abort')
                        orderbook.lastUpdateId = message.u
                    }
                }
            } catch (error) {
                console.log(error)
            }
        };

        this.heartBeat();
    }

    heartBeat() {
        setInterval(() => {
            if (this._ws.readyState === WebSocket.OPEN) {
                // this._ws.ping();
                //console.log("ping server");
            }
        }, 60000);
    }

    setHandler(method, callback) {
        if (!this._handlers.has(method)) {
            this._handlers.set(method, []);
        }
        this._handlers.get(method).push(callback);
    }
}

async function processUpdates(data) {
    for (var update in data['b']) {
        manageOrderbook('bids', data['b'][update])
    }
    for (var update in data['a']) {
        manageOrderbook('asks', data['a'][update])
    }
    updateTable(orderbook)

}

async function manageOrderbook(side, update) {
    var price = String(update[0])
    var qty = Number(update[1])
        //console.log(price, qty)
    if (qty == 0) {
        delete orderbook[side][price]
    } else {
        orderbook[side][price] = qty
    }
}

//Mapping
var centrePrice = 0
var renderDistance = 25

function truncateObject(obj, num) {
    var newObj = {}
    var log = Object.entries(obj)
    for (var j in log.slice(0, num)) {
        newObj[log[j][0]] = log[j][1]
    }
    return newObj
}

function buildMap(obj) {
    let map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}

function truncateBidMap(map, num) {
    var arrayTmp = Array.from(map).reverse().slice(0, num)
    var newMap = new Map(arrayTmp)
    return newMap
}

function truncateAskMap(map, num) {
    var arrayTmp = Array.from(map).slice(0, num)
    var newMap = new Map(arrayTmp)
    return newMap
}

async function updateTable(orderbook) {
    // FORMAT HTML TABLE
    // CONSOLIDATE PRICES
    var consolidatedBids = {}
    var consolidatedAsks = {}

    for (var j in orderbook.bids) {
        price = Number(j)
        consolidatedPrice = consolidate(price)
        qty = Number(orderbook.bids[j])
            //console.log(price, qty)
        if (consolidatedPrice in consolidatedBids) {
            consolidatedBids[consolidatedPrice] += qty
        } else {
            consolidatedBids[consolidatedPrice] = qty
        }
    }
    for (var j in orderbook.asks) {
        price = Number(j)
        consolidatedPrice = consolidate(price)
        qty = Number(orderbook.asks[j])

        if (consolidatedPrice in consolidatedAsks) {
            consolidatedAsks[consolidatedPrice] += qty
        } else {
            consolidatedAsks[consolidatedPrice] = qty
        }
    }

    const mapbid = buildMap(consolidatedBids)
    var bidMap = truncateBidMap(mapbid, renderDistance)

    const askbid = buildMap(consolidatedAsks)
    var askMap = truncateAskMap(askbid, renderDistance)


    let html = `<table>`
    html +=
        `<tr><th colspan="1">DOM</th><th colspan="1">Bids</th><th colspan="1">COMPUSDT</th><th colspan="1">Asks</th><th colspan="1">T: ${numberTrades}</th></tr>`
    for (var i = centrePrice + 50; i > centrePrice - 50; i -= consolidation) {
        if (consolidate(lastPrice.price) == i) {
            var directionColour = lastPrice.direction ? "#D23830" : "#0F969E"
            if (i in consolidatedBids) {
                // BEST BID
                html += `<tr>
                        <td>
                        <div class="meterBids">
                        <span style="width: ${consolidatedBids[i]/10}%"></span>
                        </div>
                        </td>`


                if (bidMap.get(String(i)).toFixed(3) > sizeThreshold) {
                    html +=
                        `<td style="background-color:gold; color:black;" class=bestBidCol2 onclick="BinanceFBuy(${i})">${bidMap.get(String(i)).toFixed(3)}</td>`


                } else {
                    html +=
                        `<td class=bestBidCol2 onclick="BinanceFBuy(${i})">${bidMap.get(String(i)).toFixed(3)}</td>`
                }

                if (BinanceEntryPrice === i) {
                    html += `<td style="background-color: blue; color: white;">${i + " " + PNLP1}</td>`
                } else {
                    html += `<td class=bestBidCol3>${i}</td>`
                }

                html += `<td class=bestBidCol4 onclick="BinanceFSell(${i})"></td>`
                html +=
                    `<td id="centerPrice" style="background-color:${directionColour}; color:white;">${lastPrice.qty}</td>`

            } else if (i in consolidatedAsks) {
                html += `<tr>
            <td>
            <div class="meterAsks">
              <span style="width: ${consolidatedAsks[i]/10}%"></span>
            </div>
            </td>`

                html += `<td class=bestAskCol2 onclick="BinanceFBuy(${i})"></td>`
                if (BinanceEntryPrice === i) {
                    html += `<td style="background-color: blue; color: white;">${i + " " + PNLP1}</td>`
                } else {
                    html += `<td class=bestAskCol3>${i}</td>`
                }
                html +=
                    `<td class=askCol4 onclick="BinanceFSell(${i})">${askMap.get(String(i)).toFixed(3)}</td>`
                html +=
                    `<td id="centerPrice" style="background-color:${directionColour}; color:white;">${lastPrice.qty}</td>`
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
        } else {
            if (i in consolidatedBids && volumeProfileObject && bidMap.has(String(i))) {
                // BIDS
                //console.log(i)
                html += `<tr>
            <td>
            <div class="meterBids">
              <span style="width: ${consolidatedBids[i]/10}%;"></span>
            </div>
            </td>`


                if (bidMap.get(String(i)).toFixed(3) > sizeThreshold) {
                    html +=
                        `<td style="background-color:gold;" onclick="BinanceFBuy(${i})">${bidMap.get(String(i)).toFixed(3)}</td>`


                } else {
                    html +=
                        `<td class=bidCol2 onclick="BinanceFBuy(${i})">${bidMap.get(String(i)).toFixed(3)}</td>`
                }


                if (parseInt((candleData.low / consolidation) * consolidation) === i) {
                    html +=
                        `<td style="background-color: purple; color: white; outline: 2px dashed blue;">${i}(L)</td>`
                } else if (BinanceEntryPrice === i && Amount > 0) {
                    html += `<td style="background-color: blue; color: white;">${i + " " + PNLP1}</td>`
                } else if (BinanceEntryPrice === i && Amount < 0) {
                    html += `<td style="background-color: red; color: white;">${i + " " + PNLP1}</td>`
                } else {
                    html += `<td class=bidCol3>${i}</td>`
                }

                html += `<td class=bidCol4 onclick="BinanceFSell(${i})"></td>
            <td>                
            <div class="meterAccBids">`
                if (volumeProfileObject[i] > 0) {
                    html += `<span class=bestBidCol5 style="width: ${volumeProfileObject[i]}%;"></span>`
                } else {
                    `<span style="width: 0%"></span>`
                }
                html += `</div>
                  </td>
                  </tr>`

            } else if (i in consolidatedAsks && volumeProfileObject && askMap.has(String(i))) {
                // ASKS

                html += `<tr>
            <td>
            <div class="meterAsks">
              <span style="width: ${consolidatedAsks[i]/10}%; border-left: 0px; border-right: 0px;"></span>
            </div>
            </td>`



                html += `<td class=askCol2 onclick="BinanceFBuy(${i})"></td>`

                if (parseInt((candleData.high / consolidation) * consolidation) === i) {
                    html +=
                        `<td style="background-color: purple; color: white; outline: 2px dashed blue;">${i}(H)</td>`
                } else if (BinanceEntryPrice === i && Amount > 0) {
                    html += `<td style="background-color: blue; color: white;">${i + " " + PNLP1}</td>`
                } else if (BinanceEntryPrice === i && Amount < 0) {
                    html += `<td style="background-color: red; color: white;">${i + " " + PNLP1}</td>`
                } else {
                    html += `<td class=bidCol3>${i}</td>`
                }

                if (askMap.get(String(i)).toFixed(3) > sizeThreshold) {
                    html +=
                        `<td style="background-color:gold;" onclick="BinanceFSell(${i})">${askMap.get(String(i)).toFixed(3)}</td>`
                } else {
                    html +=
                        `<td class=askCol4 onclick="BinanceFSell(${i})">${askMap.get(String(i)).toFixed(3)}</td>`
                }
                html += `<td><div class="meterAccBids">`
                if (volumeProfileObject[i] > 0) {
                    html += `<span class=askCol5 style="width: ${volumeProfileObject[i]}%;"></span>`
                } else {
                    `<span style="width: 0%"></span>`
                }
                html += `</div>
                  </td>
                  </tr>`

            } else {
                // No bids/asks
                html += `<tr>
            <td></td>`



                html += `<td class=askCol2 onclick="BinanceFBuy(${i})"></td>`
                if (parseInt(candleData.high / consolidation) * consolidation === i) {
                    html +=
                        `<td style="background-color: purple; color: white; outline: 2px dashed blue;">${i}(H)</td>`
                } else if (parseInt(candleData.low / consolidation) * consolidation === i) {
                    html +=
                        `<td style="background-color: purple; color: white; outline: 2px dashed blue;">${i}(L)</td>`
                } else if (BinanceEntryPrice === i && Amount > 0) {
                    html += `<td style="background-color: blue; color: white;">${i + " " + PNLP1}</td>`
                } else if (BinanceEntryPrice === i && Amount < 0) {
                    html += `<td style="background-color: red; color: white;">${i + " " + PNLP1}</td>`
                } else {
                    html += `<td class=bidCol3>${i}</td>`
                }

                html += `<td class=NBACol4 onclick="BinanceFSell(${i})"></td>
            <td></td>
            </tr>`
            }
        }
    }
    html += '</table>'
        //console.log(html)
    document.getElementById("compLadder").innerHTML = html;
}
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

const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: `2X6NwCa2uto2YSX0WSCKX1Xiyu2DzwzRd0AWA2M3YSyCHTVNAtDWearxekW7Eflt`,
    // APIKEY: localStorage.APIKEYSTORAGE,
    APISECRET: `A7O6GaCv2YhNNveoOpgrN5kpFVyPpNyLMuRrDAxKb0IfAlpIugiDq7eG6XDZhJxM`
        // APISECRET: localStorage.APISECRETSTORAGE
});

const socketApi = new SocketClient(`ws/compusdt@depth@100ms`, 'wss://fstream.binance.com/');

BinanceEntryPrice = 10000

// async function getBinancePositionStats() {

//     async function asyncCall() {
//         var response = (await binance.futuresPositionRisk());
//         const result = await resolveAfter2Seconds();
//         console.log(response.BTCUSDT)
//         Amount = response.BTCUSDT.positionAmt
//         Entry = (response.BTCUSDT.entryPrice)
//         BinanceEntryPrice = parseInt(Entry / consolidation) * consolidation
//         MarkPrice = Number(response.BTCUSDT.markPrice)
//         PNLP1 = Number(MarkPrice - BinanceEntryPrice).toFixed(1)
//         urpl = Number(response.BTCUSDT.unRealizedProfit)
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
const socket = new WebSocket('wss://fstream.binance.com/ws/compusdt@trade');
// Connection opened
socket.addEventListener('open', function(event) {
    socket.send('Hello Server!');
});


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


// Create WebSocket connection.
const socket1 = new WebSocket('wss://fstream.binance.com/ws/compusdt@miniTicker');
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
const socket2 = new WebSocket('wss://fstream.binance.com/ws/compusdt@ticker');
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




var volumeProfileObject = {} //   prices : qty (denoted in BTC)
var price
var rawprice


// Create WebSocket connection.
const socket3 = new WebSocket('wss://fstream.binance.com/ws/compusdt@aggTrade');
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