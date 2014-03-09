var PusherClient = require('pusher-node-client').PusherClient

var client = new PusherClient({key: 'de504dc5763aeef9ff52', secret: ''});

var channel = null;
client.on('connect', function () {
  console.log('connected');

  channel = client.subscribe('order_book')

  channel.on('success', function () {
    channel.on('data', function (data) {
      console.log(data);
    });
  });
});

client.connect();
