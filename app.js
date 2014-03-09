var PusherClient = require('./pusher-node-client').PusherClient
var fs = require('fs');
var _ = require('underscore');

var client = new PusherClient({key: 'de504dc5763aeef9ff52', secret: ''});

var book_channel = null;
var trade_channel = null;

var ts = null;
var books = [];
var trades = [];


client.on('connect', function () {
  console.log('connected');

  book_channel = client.subscribe('order_book')
  book_channel.on('success', function () {
    book_channel.on('data', function (data, ts) {
      console.log('Order book change')
      console.log(ts);
      var book = { ts: ts, book: data };
      books.push(book);
    });
  });


  trade_channel = client.subscribe('live_trades');
  trade_channel.on('success', function () {
    trade_channel.on('trade', function (data, ts) {
      console.log('Trade');
      console.log(ts);
      var trade = { ts: ts, trade: data };
      trades.push(trade);
    });
  });
});

client.connect();

var data_file = fs.openSync('./event.log', 'w');
fs.writeSync(data_file, "[\n");

setInterval(function () {

  var booksByTime = _.groupBy(books, 'ts');
  var tradesByTime = _.groupBy(trades, 'ts');

  var want = {};
  _.union(Object.keys(booksByTime), Object.keys(tradesByTime)).forEach(function(e) {
    want[e] = [];
    if(booksByTime[e]) want[e] = want[e].concat(booksByTime[e])
    if(tradesByTime[e]) want[e] = want[e].concat(tradesByTime[e])
  });

  if(Object.keys(want).length != 0) {
    fs.writeSync(data_file, JSON.stringify(want))
    fs.writeSync(data_file, ",\n");
  }

  books = [];
  trades = [];
}, 5000);

setTimeout(function () {
  fs.writeSync(data_file, ']\n');
  fs.closeSync(data_file);
  process.exit(0);
}, 5*60000);
