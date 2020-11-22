// const Binance = require('node-binance-api');
// const binance = new Binance().options({
//     APIKEY: "",
//     APISECRET: "",
// });

// LongShort()


// async function LongShort() {
//     result = await binance.longshort('BTCUSDT', '5m');
//     console.log(result);
// }

const { update } = require("lodash");

var backgroundA = 'black'
var backgroundB = 'black'

const ctxBTCRATIO = document.getElementById('BTCUSDTRATIO').getContext('2d');
const BTCCHARTRATIO = new Chart(ctxBTCRATIO, {
    type: 'pie',
    backgroundColor: 'red',
    data: {
        labels: ['B', 'A'],
        datasets: [{
            data: [Number(1), Number(1)],
            backgroundColor: ['#3BBA9F', '#AC2E27'],
        }]
    },
    options: {
        title: {
            display: true,
            fontColor: "white",
            fontStyle: "bold",
            fontSize: 18,
            text: 'Long/Short Ratio'
        },
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


const ctxBTCTAKER = document.getElementById('BTCUSDTTAKERVOLUME').getContext('2d');
const BTCCHARTTAKER = new Chart(ctxBTCTAKER, {
    type: 'pie',
    backgroundColor: 'red',
    data: {
        labels: ['B', 'A'],
        datasets: [{
            data: [Number(1), Number(1)],
            backgroundColor: ['#3BBA9F', '#AC2E27'],
        }]
    },
    options: {
        title: {
            display: true,
            fontColor: "white",
            fontStyle: "bold",
            fontSize: 18,
            text: 'Taker Buy/Sell Volume'
        },
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