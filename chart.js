 //CHART
 var chart = LightweightCharts.createChart(document.getElementById('chart'), {
     width: 1300,
     height: 775,
     layout: {
         backgroundColor: 'black',
         textColor: 'white',
         fontSize: 16,
         fontfamily: "sans-serif",
     },
     grid: {
         vertLines: {
             color: '#363C4E',
             style: 1,
             visible: false,

         },
         horzLines: {
             color: '#363C4E',
             style: 1,
             visible: false,
         },
     },
     crosshair: {
         visible: false,
     },
     priceScale: {
         autoScale: true,
     },
     timeScale: {
         autoScale: true,
         timeVisible: true,
         secondsVisible: false,
     },
     handleScroll: {
         mouseWheel: true,
         pressedMouseMove: true,
     },
     handleScale: {
         axisPressedMouseMove: true,
         mouseWheel: true,
         pinch: true,
     },
 });

 chart.applyOptions({
     watermark: {
         color: '#CDCDCE',
         visible: true,
         text: 'WebAlpha',
         fontSize: 22,
         horzAlign: 'left',
         vertAlign: 'bottom',
     },
 });

 chart.timeScale().fitContent();
 var candleSeries = chart.addCandlestickSeries({
     upColor: '#1de9b6',
     downColor: '#FF6347',
     borderVisible: false,
     wickVisible: true,
     borderColor: '#000000',
     wickColor: '#1de9b6',
     borderUpColor: '#1de9b6',
     borderDownColor: '#A52A2A',
     wickUpColor: "#1de9b6",
     wickDownColor: "#A52A2A",
 });



 //PRICE LINES

 var priceLine = []
 var RestClient = require('./DeribitIndex');
 const DeribitKey = ''
 const DeribitSecret = ''
 var restClient = new RestClient(DeribitKey, DeribitSecret);

 const Binance = require('node-binance-api');
 const {
     ifError
 } = require('assert');
 const binance = new Binance().options({
     APIKEY: "",
     APISECRET: ""
 });

 function CallData() {
     restClient.candle(1, (new Date()).getTime() - 43200000, (new Date()).getTime(), (d) => {


         //console.log(d)
         var response = d.result
         var data = []
             //console.log(response)
         for (var i = 0; i < response.volume.length; i++) {
             //console.log(i)
             //console.log(response.open[i])
             data.push({ time: response.ticks[i] / 1000, open: response.open[i], high: response.high[i], low: response.low[i], close: response.close[i] })
         }
         //console.log(data)
         candleSeries.setData(data);
     })
 }
 setInterval(CallData, 1000)
 CallData()


 //  binance.futuresCandles("BTCUSDT", "1m").then(response => {
 //      for (var i in response) {
 //          tempData = {
 //              date: parseDate(Number(response[i][0]) / 1000),
 //              open: Number(response[i][1]),
 //              high: Number(response[i][2]),
 //              low: Number(response[i][3]),
 //              close: Number(response[i][4]),
 //              volume: Number(response[i][5]),
 //              timestamp: (Number(response[i][0])) / 1000

 //          }
 //          console.log(tempData)
 //      }
 //  })


 // var margin = {
 //         top: 10,
 //         right: 20,
 //         bottom: 30,
 //         left: 60
 //     },
 //     width = 1300 - margin.left - margin.right,
 //     height = 775 - margin.top - margin.bottom;

 // var parseDate = d3.timeParse("%s"),
 //     valueFormat = d3.format(',.2f');

 // var x = techan.scale.financetime()
 //     .range([0, width]);

 // var y = d3.scaleLinear()
 //     .range([height, 0]);

 // var zoom = d3.zoom()
 //     .on("zoom", zoomed);

 // var zoomableInit;
 // var zoomableInit2

 // var candlestick = techan.plot.candlestick()
 //     .xScale(x)
 //     .yScale(y);

 // var xAxis = d3.axisBottom(x);

 // var yAxis = d3.axisLeft(y);

 // var ohlcAnnotation = techan.plot.axisannotation()
 //     .axis(yAxis)
 //     .orient('left')
 //     .format(d3.format(',.2f'));
 // var supstance = techan.plot.supstance()
 //     .xScale(x)
 //     .yScale(y)
 //     .annotation([ohlcAnnotation])
 //     .on("mouseenter", enter)
 //     .on("mouseout", out)
 //     .on("drag", drag);

 // var positionsupstances = techan.plot.supstance()
 //     .xScale(x)
 //     .yScale(y)
 //     .annotation([ohlcAnnotation])
 //     .on("mouseenter", enter)
 //     .on("mouseout", out)
 //     .on("drag", drag);

 // var svg = d3.select("#chart")
 //     .append("svg")
 //     .attr("width", width + margin.left + margin.right)
 //     .attr("height", height + margin.top + margin.bottom)
 //     .append("g")
 //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 // var defs = svg.append("defs");

 // defs.append("clipPath")
 //     .attr("id", "ohlcClip")
 //     .append("rect")
 //     .attr("x", 0)
 //     .attr("y", 0)
 //     .attr("width", width)
 //     .attr("height", height);

 // defs.append("clipPath")
 //     .attr("id", "supstanceClip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);
 // defs.append("clipPath")
 //     .attr("id", "positionSupstanceClip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);

 // defs.append("clipPath")
 //     .attr("id", "limitbuysupstanceclip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);

 // defs.append("clipPath")
 //     .attr("id", "limitsellsupstanceclip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);

 // defs.append("clipPath")
 //     .attr("id", "stopbuysupstanceclip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);

 // defs.append("clipPath")
 //     .attr("id", "stopsellsupstanceclip")
 //     .append("rect")
 //     .attr("x", -margin.left)
 //     .attr("y", 0)
 //     .attr("width", width + margin.left)
 //     .attr("height", height);
 // var valueText = svg.append('text')
 //     .style("text-anchor", "end")
 //     .attr("class", "coords")
 //     .attr("x", width - 5)
 //     .attr("y", 15);


 // svg.append("clipPath")
 //     .attr("id", "clip")
 //     .append("rect")
 //     .attr("x", 0)
 //     .attr("y", y(1))
 //     .attr("width", width)
 //     .attr("height", y(0) - y(1));

 // svg.append("g")
 //     .attr("class", "candlestick")
 //     .attr("clip-path", "url(#clip)");

 // svg.append("g")
 //     .attr("class", "x axis")
 //     .attr("transform", "translate(0," + height + ")");

 // svg.append("g")
 //     .attr("class", "y axis")
 //     .append("text")
 //     .attr("transform", "rotate(-90)")
 //     .attr("y", 1)
 //     .attr("dy", ".71em")
 //     .style("text-anchor", "end")
 //     // .text("Price ($)");

 // svg.append('text')
 //     .attr("class", "symbol")
 //     .attr("x", (width / 2) - 50)
 //     .attr('y', 10)
 //     .style("text-anchor", "left")
 //     .text("");
 // svg.append("rect")
 //     .attr("class", "pane")
 //     .attr("width", width)
 //     .attr("height", height)
 //     .call(zoom);
 // svg.append("g")
 //     .attr("class", "grid")
 //     .attr("transform", "translate(0," + height + ")")
 //     .call(make_x_gridlines()
 //         .tickSize(-height)
 //         .tickFormat("")
 //     );
 // svg.append("g")
 //     .attr("class", "grid")
 //     .call(make_y_gridlines()
 //         .tickSize(-width)
 //         .tickFormat("")
 //     );
 // svg.append("g")
 //     .attr("class", "supstances")
 //     .attr("clip-path", "url(#supstanceClip)");
 // svg.append("g")
 //     .attr("class", "positionsupstances")
 //     .attr("clip-path", "url(#positionSupstanceClip)");
 // svg.append("g")
 //     .attr("class", "limitbuysupstances")
 //     .attr("clip-path", "url(#limitbuysupstanceclip)");
 // svg.append("g")
 //     .attr("class", "limitsellsupstances")
 //     .attr("clip-path", "url(#limitsellsupstanceclip)");
 // svg.append("g")
 //     .attr("class", "stopbuysupstances")
 //     .attr("clip-path", "url(#stopbuysupstanceclip)");
 // svg.append("g")
 //     .attr("class", "stopsellsupstances")
 //     .attr("clip-path", "url(#stopsellsupstanceclip)");



 // var coordsText = svg.append('text')
 //     .style("text-anchor", "end")
 //     .attr("class", "coords")
 //     .attr("x", width - 5)
 //     .attr("y", 15);


 // function make_y_gridlines() {
 //     return d3.axisLeft(y)
 //         .ticks(1);
 // };

 // function make_x_gridlines() {
 //     return d3.axisBottom(x)
 //         .ticks(1);
 // };
 // var settings = {
 //     Execution: {
 //         symbol: "BTCUSDT",
 //     }
 // }

 // var supstanceData = []
 // var positionData = []
 // var limitBuyData = []
 // var limitSellData = []
 // var stopBuyData = []
 // var stopSellData = []
 // var feed = []
 // var updates = []
 // var positionStats = {
 //     positions: {
 //         'BTCUSDT': {
 //             positionAmt: 0
 //         }
 //     }
 // }


 // const Binance = require('node-binance-api');
 // const {
 //     ifError
 // } = require('assert');
 // const binance = new Binance().options({
 //     APIKEY: "",
 //     APISECRET: ""
 // });

 // binance.futuresCandles("BTCUSDT", "1m").then(response => {
 //     for (var i in response) {
 //         var tempData = {
 //             date: parseDate(Number(response[i][0]) / 1000),
 //             open: Number(response[i][1]),
 //             high: Number(response[i][2]),
 //             low: Number(response[i][3]),
 //             close: Number(response[i][4]),
 //             volume: Number(response[i][5]),
 //             timestamp: (Number(response[i][0])) / 1000
 //         }
 //         feed.push(tempData)

 //     }
 //     const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
 //     // Connection opened
 //     ws.addEventListener('open', function(event) {
 //         ws.send('Hello Server!');
 //     });
 //     ws.addEventListener('message', function(event) {
 //             const message = JSON.parse(event.data); // parsing single-trade record
 //             var messageTime = Math.floor(Number(message.E) / 1000)
 //             var btcPrice = Number(message.c)
 //             var lastEntry = feed[feed.length - 1]
 //             var accessor = candlestick.accessor();

 //             if ((Math.floor(messageTime / 60) * 60) == lastEntry.timestamp) {
 //                 if (btcPrice > lastEntry.high) {
 //                     lastEntry.high = btcPrice
 //                 } else if (btcPrice < lastEntry.low) {
 //                     lastEntry.low = btcPrice
 //                 }
 //                 lastEntry.close = btcPrice

 //             } else {
 //                 var tempData = {
 //                     date: parseDate(Math.floor(messageTime / 60) * 60),
 //                     open: feed[feed.length - 1].close,
 //                     high: btcPrice,
 //                     low: btcPrice,
 //                     close: btcPrice,
 //                     timestamp: (Math.floor(messageTime / 60) * 60)
 //                 }
 //                 feed.push(tempData)
 //             }
 //             supstanceData.push({
 //                 value: feed[feed.length - 1].close,
 //                 tag: ''
 //             })
 //             x.domain(feed.map(accessor.d));
 //             y.domain(techan.scale.plot.ohlc(feed, accessor).domain());

 //             svg.select("g.candlestick").datum(feed);
 //             zoomableInit = x.zoomable().clamp(false).copy();
 //             redraw(feed.slice(feed.length - 300, ))
 //             supstanceData = []
 //         }


 //     );
 // })


 // var rescaledY;
 // var rescaledX;


 // function zoomed() {
 //     rescaledY = d3.event.transform.rescaleY(y);
 //     rescaledX = d3.event.transform.rescaleX(zoomableInit);
 //     yAxis.scale(rescaledY);
 //     candlestick.yScale(rescaledY);
 //     supstance.yScale(rescaledY)
 //     positionsupstances.yScale(rescaledY)
 //     x.zoomable().domain(rescaledX.domain());
 //     draw();
 // }



 // function redraw(d) {
 //     var accessor = candlestick.accessor();
 //     x.domain(d.map(accessor.d));
 //     y.domain(techan.scale.plot.ohlc(d, accessor).domain());
 //     zoomableInit = x.zoomable().clamp(false).copy();

 //     if (rescaledY || rescaledX) {
 //         yAxis.scale(rescaledY);
 //         candlestick.yScale(rescaledY);
 //         supstance.yScale(rescaledY)
 //         positionsupstances.yScale(rescaledY)
 //         x.zoomable().domain(rescaledX.domain());
 //     }

 //     svg.select('g.x.axis').call(xAxis);
 //     svg.select('g.y.axis').call(yAxis);

 //     svg.select("g.candlestick").datum(d).call(candlestick);
 //     svg.selectAll("g.supstances").datum(supstanceData).call(supstance);
 //     svg.selectAll('g.positionsupstances').datum(positionData).call(supstance).classed('positionSupstance', true).classed('axispositionannotation', true)
 //     svg.selectAll('g.limitbuysupstances').datum(limitBuyData).call(supstance).classed('buySupstance', true).classed('axisbuyannotation', true).call(supstance.drag)
 //     svg.selectAll('g.limitsellsupstances').datum(limitSellData).call(supstance).classed('sellSupstance', true).classed('axissellannotation', true).call(supstance.drag)
 //     svg.selectAll('g.stopbuysupstances').datum(stopBuyData).call(supstance).classed('stopbuySupstance', true).classed('axisbuyannotation', true).call(supstance.drag)
 //     svg.selectAll('g.stopsellsupstances').datum(stopSellData).call(supstance).classed('stopsellSupstance', true).classed('axissellannotation', true).call(supstance.drag)
 // }

 // function draw() {
 //     svg.select("g.candlestick").call(candlestick);
 //     svg.select("g.x.axis").call(xAxis);
 //     svg.select("g.y.axis").call(yAxis)

 // }

 // function move(coords) {
 //     coordsText.text(
 //         timeAnnotation.format()(coords.x) + ", " + candleAnnotation.format()(coords.y)
 //     );
 // }

 // function enter(d) {
 //     valueText.style("display", "inline");
 //     refreshText(d);
 // }

 // function out() {
 //     valueText.style("display", "none");
 // }

 // function drag(d) {
 //     refreshText(d);
 // }

 // function refreshText(d) {
 //     valueText.text("Value: " + valueFormat(d.value));
 // }