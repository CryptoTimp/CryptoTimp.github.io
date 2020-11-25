var wsLINKUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=linkusdt@depth20@100ms');
wsLINKUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    LINKBIDS = ((response.data.a))
    LINKASKS = ((response.data.b))

    var linkbooktable = '<table>'
    var threshold = 2000

    for (var i in LINKBIDS) {
        if (Number(LINKBIDS[i][1]).toFixed(2) > threshold) {
            linkbooktable +=
                `<tr><td style="background-color: #232931; color:white;">${Number(LINKASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(LINKASKS[i][0]).toFixed(3)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(LINKBIDS[i][0]).toFixed(3)}</td><td style="background-color: gold; color:black;">${Number(LINKBIDS[i][1]).toFixed(2)}</td>`
        } else if (Number(LINKASKS[i][1]).toFixed(2) > threshold) {
            linkbooktable += `<tr><td style="background-color: gold; color:black;">${Number(LINKASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(LINKASKS[i][0]).toFixed(3)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(LINKBIDS[i][0]).toFixed(3)}</td><td style="background-color: #232931; color:white;">${Number(LINKBIDS[i][1]).toFixed(2)}</td>`
        } else {
            linkbooktable += `<tr><td style="background-color: #232931; color:white;">${Number(LINKASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(LINKASKS[i][0]).toFixed(3)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(LINKBIDS[i][0]).toFixed(3)}</td><td style="background-color: #232931; color:white;">${Number(LINKBIDS[i][1]).toFixed(2)}</td>`

        }
    }

    linkbooktable += '</table>'
    document.getElementById("LINKBOOK").innerHTML = linkbooktable;


})

var wsLINKUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=linkusdt@bookTicker');
wsLINKUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    LINKUSDTBID = response.data.b
    LINKUSDTASK = response.data.a
    LINKUSDTBIDSIZE = response.data.B
    LINKUSDTASKSIZE = response.data.A

    document.getElementById('LINKUSDTBID').innerHTML = LINKUSDTBID;
    document.getElementById('LINKUSDTASK').innerHTML = LINKUSDTASK;
    document.getElementById('LINKUSDTBIDSIZE').innerHTML = LINKUSDTBIDSIZE;
    document.getElementById('LINKUSDTASKSIZE').innerHTML = LINKUSDTASKSIZE;





})


var wsYFIUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=yfiusdt@depth20@100ms');
wsYFIUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    YFIBIDS = ((response.data.a))
    YFIASKS = ((response.data.b))

    var yfibooktable = '<table>'
    var threshold = 0.5

    for (var i in YFIBIDS) {
        if (Number(YFIBIDS[i][1]).toFixed(2) > threshold) {
            yfibooktable +=
                `<tr><td style="background-color: #232931; color:white;">${Number(YFIASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(YFIASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(YFIBIDS[i][0]).toFixed(1)}</td><td style="background-color: gold; color:black;">${Number(YFIBIDS[i][1]).toFixed(2)}</td>`
        } else if (Number(YFIASKS[i][1]).toFixed(2) > threshold) {
            yfibooktable += `<tr><td style="background-color: gold; color:black;">${Number(YFIASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(YFIASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(YFIBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(YFIBIDS[i][1]).toFixed(2)}</td>`
        } else {
            yfibooktable += `<tr><td style="background-color: #232931; color:white;">${Number(YFIASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(YFIASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(YFIBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(YFIBIDS[i][1]).toFixed(2)}</td>`

        }
    }

    yfibooktable += '</table>'
    document.getElementById("YFIBOOK").innerHTML = yfibooktable;


})

var wsYFIUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=yfiusdt@bookTicker');
wsYFIUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    YFIUSDTBID = response.data.b
    YFIUSDTASK = response.data.a
    YFIUSDTBIDSIZE = response.data.B
    YFIUSDTASKSIZE = response.data.A

    document.getElementById('YFIUSDTBID').innerHTML = YFIUSDTBID;
    document.getElementById('YFIUSDTASK').innerHTML = YFIUSDTASK;
    document.getElementById('YFIUSDTBIDSIZE').innerHTML = YFIUSDTBIDSIZE;
    document.getElementById('YFIUSDTASKSIZE').innerHTML = YFIUSDTASKSIZE;





})


var wsCOMPUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=compusdt@depth20@100ms');
wsCOMPUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    COMPBIDS = ((response.data.a))
    COMPASKS = ((response.data.b))

    var compbooktable = '<table>'
    var threshold = 10

    for (var i in COMPBIDS) {
        if (Number(COMPBIDS[i][1]).toFixed(2) > threshold) {
            compbooktable +=
                `<tr><td style="background-color: #232931; color:white;">${Number(COMPASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(COMPASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(COMPBIDS[i][0]).toFixed(1)}</td><td style="background-color: gold; color:black;">${Number(COMPBIDS[i][1]).toFixed(2)}</td>`
        } else if (Number(COMPASKS[i][1]).toFixed(2) > threshold) {
            compbooktable += `<tr><td style="background-color: gold; color:black;">${Number(COMPASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(COMPASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(COMPBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(COMPBIDS[i][1]).toFixed(2)}</td>`
        } else {
            compbooktable += `<tr><td style="background-color: #232931; color:white;">${Number(COMPASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(COMPASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(COMPBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(COMPBIDS[i][1]).toFixed(2)}</td>`

        }
    }

    compbooktable += '</table>'
    document.getElementById("COMPBOOK").innerHTML = compbooktable;


})

var wsCOMPUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=compusdt@bookTicker');
wsCOMPUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    COMPUSDTBID = response.data.b
    COMPUSDTASK = response.data.a
    COMPUSDTBIDSIZE = response.data.B
    COMPUSDTASKSIZE = response.data.A

    document.getElementById('COMPUSDTBID').innerHTML = COMPUSDTBID;
    document.getElementById('COMPUSDTASK').innerHTML = COMPUSDTASK;
    document.getElementById('COMPUSDTBIDSIZE').innerHTML = COMPUSDTBIDSIZE;
    document.getElementById('COMPUSDTASKSIZE').innerHTML = COMPUSDTASKSIZE;





})

var wsMKRUSDTBOOK = new WebSocket('wss://fstream.binance.com/stream?streams=mkrusdt@depth20@100ms');
wsMKRUSDTBOOK.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log(response)
    MKRBIDS = ((response.data.a))
    MKRASKS = ((response.data.b))

    var mkrbooktable = '<table>'
    var threshold = 0.5

    for (var i in MKRBIDS) {
        if (Number(MKRBIDS[i][1]).toFixed(2) > threshold) {
            mkrbooktable +=
                `<tr><td style="background-color: #232931; color:white;">${Number(MKRASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(MKRASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(MKRBIDS[i][0]).toFixed(1)}</td><td style="background-color: gold; color:black;">${Number(MKRBIDS[i][1]).toFixed(2)}</td>`
        } else if (Number(MKRASKS[i][1]).toFixed(2) > threshold) {
            mkrbooktable += `<tr><td style="background-color: gold; color:black;">${Number(MKRASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(MKRASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(MKRBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(MKRBIDS[i][1]).toFixed(2)}</td>`
        } else {
            mkrbooktable += `<tr><td style="background-color: #232931; color:white;">${Number(MKRASKS[i][1]).toFixed(2)}</td><td style="background-color: #132E25; color:#1de9b6;">${Number(MKRASKS[i][0]).toFixed(1)}</td><td style="background-color: #401828; color:#1de9b6;">${Number(MKRBIDS[i][0]).toFixed(1)}</td><td style="background-color: #232931; color:white;">${Number(MKRBIDS[i][1]).toFixed(2)}</td>`

        }
    }

    mkrbooktable += '</table>'
    document.getElementById("MKRBOOK").innerHTML = mkrbooktable;


})

var wsMKRUSDT = new WebSocket('wss://fstream.binance.com/stream?streams=mkrusdt@bookTicker');
wsMKRUSDT.addEventListener('message', function incoming(event) {
    response = JSON.parse(event.data)
        //console.log((response.data))

    MKRUSDTBID = response.data.b
    MKRUSDTASK = response.data.a
    MKRUSDTBIDSIZE = response.data.B
    MKRUSDTASKSIZE = response.data.A

    document.getElementById('MKRUSDTBID').innerHTML = MKRUSDTBID;
    document.getElementById('MKRUSDTASK').innerHTML = MKRUSDTASK;
    document.getElementById('MKRUSDTBIDSIZE').innerHTML = MKRUSDTBIDSIZE;
    document.getElementById('MKRUSDTASKSIZE').innerHTML = MKRUSDTASKSIZE;





})