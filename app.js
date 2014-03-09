var PusherClient = require('./pusher-node-client').PusherClient

var client = new PusherClient({key: 'de504dc5763aeef9ff52', secret: ''});

var book = null;
var trades = null;
client.on('connect', function () {
  console.log('connected');

  book = client.subscribe('order_book')

  book.on('success', function () {
    book.on('data', function (data, ts) {
      // console.log(data);
      console.log('Order book change')
      console.log(ts);
    });
  });


  trades = client.subscribe('live_trades');

  trades.on('success', function () {
    trades.on('trade', function (data, ts) {
      // console.log(data);
      console.log('Trade');
      console.log(ts);
    });
  });
});

client.connect();
