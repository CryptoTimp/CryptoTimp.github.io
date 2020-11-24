(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// VENUS FUTURES 
var settings
settings = {
    "codes": {
        Deribit: {
            Active: "BTC-PERPETUAL"
        },
        Bitmex: {
            Active: "XBTUSD"
        },
        FTX: {
            Active: "BTC/USD"
        },
        Binance: {
            Active: "BTCUSDT",
            Websocket: "btcusdt",
        }
    },
}
var exchangeObject = {
    Deribit: {},
    Binance: {},
    FTX: {},
}

var liquidityObject = {}
var spreadObject = {}








var msg = {
    "jsonrpc": "2.0",
    "method": "public/subscribe",
    "id": 42,
    "params": {
        "channels": ["quote.BTC-PERPETUAL"]
    }
};
var ws = new WebSocket('wss://test.deribit.com/ws/api/v2');
ws.onmessage = function(e) {
    try {
        // do something with the notifications...
        response = JSON.parse(e.data)

        exchangeObject.Deribit.bestBid = Number(response.params.data.best_bid_price)
        exchangeObject.Deribit.bestAsk = Number(response.params.data.best_ask_price)
        exchangeObject.Deribit.bestBidSize = Number(response.params.data.best_ask_amount)
        exchangeObject.Deribit.bestAskSize = Number(response.params.data.best_ask_amount)
    } catch (error) {}
};
ws.onopen = function() {
    ws.send(JSON.stringify(msg));
};

//Binance Ticker
const socket = new WebSocket(`wss://fstream.binance.com/ws/${settings.codes.Binance.Websocket}@bookTicker`);

socket.addEventListener('open', function(event) {
    socket.send('Hello Server!');
});

socket.addEventListener('message', function(event) {
    const ticker = JSON.parse(event.data); // parsing single-trade record

    exchangeObject.Binance.bestBid = Number(ticker.b)
    exchangeObject.Binance.bestAsk = Number(ticker.a)
    exchangeObject.Binance.bestBidSize = Number(ticker.B) * 100
    exchangeObject.Binance.bestAskSize = Number(ticker.A) * 100

});


let msgFTX = {
    "op": "subscribe",
    "channel": "ticker",
    "market": "BTC-PERP"
}


const wsFTX = new WebSocket('wss://ftx.com/ws/')

wsFTX.onmessage = function(a) {
    response1 = JSON.parse(a.data)

    exchangeObject.FTX.bestBid = Number(response1.data.bid)
    exchangeObject.FTX.bestAsk = Number(response1.data.ask)
    exchangeObject.FTX.bestBidSize = Number(response1.data.bidSize)
    exchangeObject.FTX.bestAskSize = Number(response1.data.askSize)


}
wsFTX.onopen = function() {
    wsFTX.send(JSON.stringify(msgFTX));
};

//LIQUIDITY SCANNER
function liquidityScanner() {
    for (var x in exchangeObject) {
        var ask = exchangeObject[x].bestAskSize
        for (var y in exchangeObject) {
            var bid = exchangeObject[y].bestBidSize
            var liquidity = Math.min(bid, ask)
            if (x != y) { liquidityObject[x + '-' + y] = liquidity.toFixed(3) }

        }
        //console.log(liquidityObject)
    }
}
setInterval(liquidityScanner, 1000)

//SPREAD CALCULATOR          
function calculateSpreads() {
    for (var x in exchangeObject) {
        var ask = exchangeObject[x].bestAsk
        for (var y in exchangeObject) {
            var bid = exchangeObject[y].bestBid
            var spread = ((bid - ask) / bid) * 100
            if (x != y) { spreadObject[x + '-' + y] = spread.toFixed(3) }

            //console.log(spreadObject)

            xValues = [`Deribit`, `Binance`, `FTX`];

            yValues = ['Deribit', 'Binance', `FTX`];

            zValues = [

                    [null,
                        spreadObject["Deribit-FTX"],
                        spreadObject["Deribit-Binance"],
                    ],

                    [
                        spreadObject["Binance-Deribit"],
                        null,
                        spreadObject["Binance-FTX"],
                    ],
                    [
                        spreadObject["FTX-Binance"],
                        spreadObject["FTX-Deribit"],
                        null,
                    ],
                ],


                colorscaleValue = [

                    [1, '#3BBA9F'],
                    [0, 'black'],
                    [-1, '#AC2E27'],

                ];

            var data = [{
                x: xValues,
                y: yValues,
                z: zValues,
                type: 'heatmap',
                colorscale: colorscaleValue,
                showscale: false,
                font: {
                    family: 'Arial',
                    size: 14,
                    color: 'white'
                },

            }];

            var layout = {
                title: 'Cross Exchange Spreads (%)',
                annotations: [],
                plot_bgcolor: "black",
                paper_bgcolor: "black",
                font: {
                    color: "white",
                    size: 16,
                },
                xaxis: {
                    ticks: '',
                    side: 'top'
                },
                yaxis: {
                    ticks: '',
                    ticksuffix: ' ',
                    width: 650,
                    height: 900,
                    autosize: false
                }
            };

            for (var i = 0; i < yValues.length; i++) {
                for (var j = 0; j < xValues.length; j++) {
                    var currentValue = zValues[i][j];
                    if (currentValue = "new text") {
                        var textColor = 'white';

                    }
                    var result = {
                        xref: 'x1',
                        yref: 'y1',
                        x: xValues[j],
                        y: yValues[i],
                        text: zValues[i][j],
                        font: {
                            family: 'Arial',
                            size: 14,
                            color: 'white'
                        },
                        showarrow: true,
                        font: {
                            color: textColor
                        }
                    };
                    layout.annotations.push(result);
                }
            }

            Plotly.newPlot('myDiv', data, layout, { displayModeBar: false });
        }
    }
}
setInterval(calculateSpreads, 1000)
},{}]},{},[1]);
