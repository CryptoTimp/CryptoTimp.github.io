const { update } = require("lodash");

var backgroundA = 'black'
var backgroundB = 'black'

const ctxBTC = document.getElementById('BTCUSDT').getContext('2d');
const BTCCHART = new Chart(ctxBTC, {
    type: 'bar',
    backgroundColor: 'red',
    data: {
        labels: ['B', 'A'],
        datasets: [{
            data: [Number(1), Number(1)],
            backgroundColor: ['#3BBA9F', '#AC2E27'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        scales: {
            ticks: {
                beginAtZero: true
            },
            yAxes: [{
                display: false
            }],
            xAxes: [{
                display: false,
                // barPercentage: 3
            }]
        }
    }
});
var wsBTCUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=btcusdt@depth5@100ms');
wsBTCUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    BTCBIDS = ((response.data.a))
    BTCASKS = ((response.data.b))

    var btcbooktable = '<table>'

    for (var i in BTCBIDS) {
        btcbooktable +=
            `<tr><td style="background-color: #232931; color:white;">${Number(BTCASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(BTCASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(BTCBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(BTCBIDS[i][1]).toFixed(2)}</td>`

    }

    btcbooktable += '</table>'
    document.getElementById("BTCBOOK").innerHTML = btcbooktable;


})

var wsBTCUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=btcusdt@bookTicker');
wsBTCUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    BTCUSDTBID = response.data.b
    BTCUSDTASK = response.data.a
    BTCUSDTBIDSIZE = response.data.B
    BTCUSDTASKSIZE = response.data.A

    document.getElementById('BTCUSDTBID').innerHTML = BTCUSDTBID;
    document.getElementById('BTCUSDTASK').innerHTML = BTCUSDTASK;
    document.getElementById('BTCUSDTBIDSIZE').innerHTML = BTCUSDTBIDSIZE;
    document.getElementById('BTCUSDTASKSIZE').innerHTML = BTCUSDTASKSIZE;




    if (BTCUSDTBIDSIZE > BTCUSDTASKSIZE) {
        document.getElementById('BTCUSDTDIV').style.backgroundColor = backgroundA;
    } else {
        document.getElementById('BTCUSDTDIV').style.backgroundColor = backgroundB;
    }


})

function adjustBTC() {
    BTCCHART.data.datasets[0].data[0] = BTCUSDTBIDSIZE;
    BTCCHART.data.datasets[0].data[1] = BTCUSDTASKSIZE;
    BTCCHART.update();
}

const ctxETH = document.getElementById('ETHUSDT').getContext('2d');
const ETHCHART = new Chart(ctxETH, {
    type: 'bar',
    backgroundColor: 'red',
    data: {
        labels: ['B', 'A'],
        datasets: [{
            data: [Number(1), Number(1)],
            backgroundColor: ['#3BBA9F', '#AC2E27'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        scales: {
            ticks: {
                beginAtZero: true
            },
            yAxes: [{
                display: false
            }],
            xAxes: [{
                display: false,
                // barPercentage: 3
            }]
        }
    }
});
var wsETHUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=ethusdt@depth5@100ms');
wsETHUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    ETHBIDS = ((response.data.a))
    ETHASKS = ((response.data.b))

    var ethbooktable = '<table>'

    for (var i in ETHBIDS) {
        ethbooktable +=
            `<tr><td style="background-color: #232931; color:white;">${Number(ETHASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(ETHASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(ETHBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(ETHBIDS[i][1]).toFixed(2)}</td>`

    }

    ethbooktable += '</table>'
    document.getElementById("ETHBOOK").innerHTML = ethbooktable;


})

var wsETHUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=ethusdt@bookTicker');
wsETHUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    ETHUSDTBID = response.data.b
    ETHUSDTASK = response.data.a
    ETHUSDTBIDSIZE = response.data.B
    ETHUSDTASKSIZE = response.data.A

    document.getElementById('ETHUSDTBID').innerHTML = ETHUSDTBID;
    document.getElementById('ETHUSDTASK').innerHTML = ETHUSDTASK;
    document.getElementById('ETHUSDTBIDSIZE').innerHTML = ETHUSDTBIDSIZE;
    document.getElementById('ETHUSDTASKSIZE').innerHTML = ETHUSDTASKSIZE;



    if (ETHUSDTBIDSIZE > ETHUSDTASKSIZE) {
        document.getElementById('ETHUSDTDIV').style.backgroundColor = backgroundA;
    } else {
        document.getElementById('ETHUSDTDIV').style.backgroundColor = backgroundB;
    }


})

function adjustETH() {
    ETHCHART.data.datasets[0].data[0] = ETHUSDTBIDSIZE;
    ETHCHART.data.datasets[0].data[1] = ETHUSDTASKSIZE;
    ETHCHART.update();
}

function updateValues() {
    adjustETH()
    adjustBTC()
}
setInterval(updateValues, 500)