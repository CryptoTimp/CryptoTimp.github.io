var msg = {
    "id": 1,
    "method": "subscribe",
    "params": [
        "BTCUSD-PERP@orderbook_25"
    ]
}

var ws = new WebSocket('wss://ws.mapi.digitexfutures.com');
ws.onmessage = function(e) {
    // do something with the notifications...
    console.log('received from server : ', e.data);
};
ws.onopen = function() {
    ws.send(JSON.stringify(msg));
};