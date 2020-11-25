const Binance = require('node-binance-api');
const binance = new Binance().options({
	APIKEY: '2X6NwCa2uto2YSX0WSCKX1Xiyu2DzwzRd0AWA2M3YSyCHTVNAtDWearxekW7Eflt',
	APISECRET: 'A7O6GaCv2YhNNveoOpgrN5kpFVyPpNyLMuRrDAxKb0IfAlpIugiDq7eG6XDZhJxM'
});
main()

async function main(){
    var tickers = await binance.futuresPrices() ;
    var symbols = Object.keys(tickers)
    //var symbols = ["BTCUSDT", "ETHUSDT", "LTCUSDT"]
    console.log(`Loaded ${symbols.length} pairs`)
    var candles = {}
    for (var i in symbols) {
        console.log(`Collecting ${symbols[i]} data`)
        response = await binance.futuresCandles( symbols[i], "1m" ) ;
        //console.log(response)
        var closeValues = []
        for (var j in response){
            closeValues.push(Number(response[j][4]))
        }
        candles[symbols[i]] = closeValues
        console.log(`${symbols[i]}: Loaded ${candles[symbols[i]].length} values`)
        
    }
    
    var symbolPairings = (pairwise(symbols))
    console.log(symbolPairings)
    symbolPairings.forEach(i => {
        //console.log(candles[i[0]], candles[i[1]])
        pearsonsCorrelation(candles[i[0]], candles[i[1]], i[0], i[1])
    })
    console.log(correlationData)
    
}


function pairwise(list) {
    if (list.length < 2) { return []; }
    var first = list[0],
        rest  = list.slice(1),
        pairs = rest.map(function (x) { return [first, x]; });
    return pairs.concat(pairwise(rest));
  }
var correlationData = []
  //Pearson's Function
pearsonsCorrelation = (x, y, ticker1, ticker2) => {
    let arrayLength = 0;

    if (x.length === y.length) {
      arrayLength = x.length;
    } else if (x.length > y.length) {
      //Handles errors for conflicts of difference in length of arrays inputed [x]&[y]
      arrayLength = y.length;
      console.error(
        "Array X has more items in it, the last " +
          (x.length - arrayLength) +
          " will not run in the correlation..."
      );
    } else {
      arrayLength = x.length;
      console.error(
        "Array Y has more values in it, the last " +
          (y.length - arrayLength) +
          " will not run in the correlation..."
      );
    }

    let xy = [];
    let x2 = [];
    let y2 = [];

    for (let i = 0; i < arrayLength; i++) {
      xy.push(x[i] * y[i]);
      x2.push(x[i] * x[i]);
      y2.push(y[i] * y[i]);
    }

    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_x2 = 0;
    let sum_y2 = 0;

    for (let i = 0; i < arrayLength; i++) {
      sum_x += x[i];
      sum_y += y[i];
      sum_xy += xy[i];
      sum_x2 += x2[i];
      sum_y2 += y2[i];
    }

    let stepOne = arrayLength * sum_xy - sum_x * sum_y;
    let stepTwo = arrayLength * sum_x2 - sum_x * sum_x;
    let stepThree = arrayLength * sum_y2 - sum_y * sum_y;
    let stepFour = Math.sqrt(stepTwo * stepThree);
    let r = stepOne / stepFour;
    let rSquared = r*r
    //console.log(`${ticker1}/${ticker2} pearson: (r) = ${r.toFixed(2)}, (r^2) = ${rSquared.toFixed(2)}`)
    pair = `${ticker1}/${ticker2}`
    correlationData.push({pair: pair, ticker1: ticker1, ticker2:ticker2, r2: rSquared.toFixed(2)})
  };
  