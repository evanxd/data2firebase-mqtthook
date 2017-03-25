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
  // We always save the sensor data's datetime with server datetime.
  data = filter(data);
  data.datetime = new Date().toUTCString();
  ref.child('data').push(data, error => {
    config.debug && (error ? console.error(error.message) :
                             console.log(`Data: ${JSON.stringify(data)}`));
  });
});

function filter(_data) {
  if (!config.dataFilter) {
    return _data;
  }
  var data = {};
  for (var key in _data) {
    if (config.dataFilter[key]) {
      data[key] = _data[key];
    }
  }
  return data;
}
