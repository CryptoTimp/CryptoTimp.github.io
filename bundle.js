var _ = require('lodash')
var $ = require('jquery')


// Create WebSocket connection.
const socket = new WebSocket('wss://fstream.binance.com/ws/btcusdt@trade');

// Connection opened
socket.addEventListener('open', function(event) {
    socket.send('Hello Server!');
});

var backgroundA = '#d6ffdc'
var backgroundB = '#ffe0e0'

// var grid = GridStack.init();
const consolidation = 1
var settings = require("./settings.js")

var BinanceTOSData = []
var lastTrade


// Listen for messages
socket.addEventListener('message', function(event) {
    const trade = JSON.parse(event.data);
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


function RenderBinanceTOS() {
    //BINANCE TOS
    var BinanceTOSTable = '<table>'
        //console.log(BinanceTOSData)
    BinanceTOSTable += `<tr id = "row00" > <th colspan="4"> TOS</th>`
    BinanceTOSTable += `<tr id = "row0" > <td>Time</td> <td>Price</td> <td>Qty</td> <td>Tick</td>`
    var oldPrice = undefined
    for (var i = BinanceTOSData.length - 1; i >= 0; i--) {

        // Convert BTC size to USD
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
            colour = "white"
        }
        //console.log(BinanceTOSData[i].q, colour)
        // Find direction colour:
        var directionColour
        if (BinanceTOSData[i].m) {
            directionColour = `<td style="background-color:${colour}; color: ${settings.BinanceTOS.downTickColour}">🡇</td>`
        } else {
            directionColour = `<td style="background-color:${colour}; color: ${settings.BinanceTOS.upTickColour}">🡅</td>`
        }

        // Add data
        BinanceTOSTable += `<tr> <td style="background-color:${colour}">${timeConverter(BinanceTOSData[i].E)}</td><td style="background-color:${colour}"> ${BinanceTOSData[i].p}</td><td style="background-color:${colour}"> ${size}</td>${directionColour}</tr>`


        oldPrice = BinanceTOSData[i].p
    }

    BinanceTOSTable += '</table>'
    document.getElementById("BinanceTOS").innerHTML = BinanceTOSTable;
    // $("#BinanceTOS").add(BinanceTOSTable);
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