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
            backgroundColor: ['#AC2E27', '#3BBA9F'],
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

    adjustBTC()


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