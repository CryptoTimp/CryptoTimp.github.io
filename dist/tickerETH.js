(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var settings = {
    Version: "0.5",
    APIKey: `2X6NwCa2uto2YSX0WSCKX1Xiyu2DzwzRd0AWA2M3YSyCHTVNAtDWearxekW7Eflt`,
    APISecret: `A7O6GaCv2YhNNveoOpgrN5kpFVyPpNyLMuRrDAxKb0IfAlpIugiDq7eG6XDZhJxM`,
    marketWatch: {
        fundingThreshold: 0.05,
        upTickColour: "white",
        upTickBackground: "green",
        downTickColour: "white",
        downTickBackground: "red",
        triggerColour: "purple",
        thresholdHourly: 1,
        threshold6Hourly: 3,
        thresholdDaily: 5,
        thresholdWeekly: 10,
    },
    LiquidationTOS: {
        sizeThreshold: 1000,
        tableLength: 75,
        highlightThreshold1: 100000,
        highlightThreshold2: 500000,
        highlightThreshold3: 1000000,
        highlightThreshold1Colour: "steelblue",
        highlightThreshold2Colour: "tomato",
        highlightThreshold3Colour: "red",
        upTickColour: "green",
        downTickColour: "red",
    },
    BinanceTOS: {
        sizeThreshold: 1000,
        tableLength: 75,
        highlightThreshold1: 100000,
        highlightThreshold2: 500000,
        highlightThreshold3: 1000000,
        highlightThreshold1Colour: "purple",
        highlightThreshold2Colour: "blue",
        highlightThreshold3Colour: "crimson",
        upTickColour: "green",
        downTickColour: "red",
    },
    BitMEXTOS: {
        sizeThreshold: 1000,
        tableLength: 75,
        highlightThreshold1: 100000,
        highlightThreshold2: 500000,
        highlightThreshold3: 1000000,
        highlightThreshold1Colour: "purple",
        highlightThreshold2Colour: "blue",
        highlightThreshold3Colour: "crimson",
        upTickColour: "green",
        downTickColour: "red",
    },
    UserTrades: {
        amtTrades: 100,
    },
    OpenOrders: {
        amtOrders: 20,
    },
    RiskLadder: {
        priceRange: 500,
        consolidation: 1,
        entryPriceColour: "blue",
        entryPriceLabel: "Entry",
        bidColour: "#228B22",
        askColour: "#8B0000",
    },
    CorrelationMatrix: {
        timeframe: "1m",

    }

}
module.exports = settings
},{}],2:[function(require,module,exports){
var grid = GridStack.init();

const consolidation = 1
var settings = require("./settings.js")

var BinanceTOSData = []
var lastTrade
const ws2 = new WebSocket('wss://fstream.binance.com/ws/ethusdt@trade');

// Connection opened
ws2.addEventListener('open', function(event) {
    ws2.send('Hello Server!');
});

ws2.addEventListener('message', function(event) {
    const trade = JSON.parse(event.data); // parsing single-trade record
    lastTrade = {}
    lastTrade.price = parseInt((trade.p) / consolidation) * consolidation
    lastTrade.size = (trade.q)
        //console.log(trade)

    lastTrade.direction = (trade.m)
    if ((Number(trade.q) * Number(trade.p)) > settings.BinanceTOS.sizeThreshold) {
        BinanceTOSData.push(JSON.parse(event.data))
        if (BinanceTOSData.length > settings.BinanceTOS.tableLength) {
            BinanceTOSData.shift()
        }
    }
});
var textColour = 'white'

function RenderBinanceTOS() {
    //BINANCE TOS
    var BinanceTOSTable = '<table>'
        //console.log(BinanceTOSData)
    BinanceTOSTable += `<tr id = "row00" > <th colspan="3"><img src="binance_futures.svg" width="10" height="10"> ETHUSDT</th>`
    var oldPrice = undefined
    for (var i = BinanceTOSData.length - 1; i >= 0; i--) {

        // Convert ETH size to USD
        var size = parseInt(Number(BinanceTOSData[i].q) * Number(BinanceTOSData[i].p)).toLocaleString()
        var normalSize = parseInt(Number(BinanceTOSData[i].q) * Number(BinanceTOSData[i].p))
            // Find size colour:
        var colour
        if (normalSize > settings.BinanceTOS.highlightThreshold3) {
            colour = settings.BinanceTOS.highlightThreshold3Colour
        } else if (normalSize > settings.BinanceTOS.highlightThreshold2) {
            colour = settings.BinanceTOS.highlightThreshold2Colour
        } else if (normalSize > settings.BinanceTOS.highlightThreshold1) {
            colour = settings.BinanceTOS.highlightThreshold1Colour
        } else {
            if (BinanceTOSData[i].m) {
                colour = "rgba(255, 0, 0, 0.1)"
            } else {
                colour = "rgba(0, 255, 0, 0.1)"
            }
        }
        //console.log(BinanceTOSData[i].q, colour)
        // Find direction colour:
        var directionColour
        if (BinanceTOSData[i].m) {
            directionColour = `<td style="background-color:${colour}; color: ${settings.BinanceTOS.downTickColour}"><i class="ri-arrow-down-circle-fill"></i></td>`
        } else {
            directionColour = `<td style="background-color:${colour}; color: ${settings.BinanceTOS.upTickColour}"><i class="ri-arrow-up-circle-fill"></i></td>`
        }

        // Add data
        BinanceTOSTable += `<tr> <td style="background-color:${colour}; color:${textColour};"> ${BinanceTOSData[i].p}</td><td style="background-color:${colour}; color:${textColour};"> ${size}</td>${directionColour}</tr>`


        oldPrice = BinanceTOSData[i].p
    }

    BinanceTOSTable += '</table>'
    document.getElementById("TOSETH").innerHTML = BinanceTOSTable;
}
setInterval(RenderBinanceTOS, 100)

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec;
    return time;
}
},{"./settings.js":1}]},{},[2]);
