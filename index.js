var config = require('./config.json');
var MQTThook = require('mqtthook');
var mqtthook = new MQTThook(config.mqtthook.brokerUrl, config.mqtthook.options);
var firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert(require('./auth.json')),
  databaseURL: config.databaseURL,
});

var ref = firebase.database().ref(config.dataReferencePath);
ref.child('info').set(config.deviceInfo);

mqtthook.hook(config.mqtthook.topic).trigger(data => {
  data.datetime = data.datetime || new Date().toUTCString();
  ref.child('data').push(data, error => {
    config.debug && (error ? console.error(error.message) :
                             console.log(`Data: ${JSON.stringify(data)}`));
  });
});
