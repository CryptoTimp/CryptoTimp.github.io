const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: "",
    APISECRET: "",
});

LongShort()


async function LongShort() {
    result = await binance.longshort('BTCUSDT', '5m');
    console.log(result);
}