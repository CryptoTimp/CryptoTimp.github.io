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
            colour = "black"
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