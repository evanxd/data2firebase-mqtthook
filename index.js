var config = require('./config.json');
var MQTThook = require('mqtthook');
var mqtthook = new MQTThook(config.mqtthook.brokerUrl, config.mqtthook.options);
var firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert(require('./auth.json')),
  databaseURL: config.databaseURL,
});

var ref = firebase.database().ref(config.referencePath);

ref.child('info').set({ name: config.stationInfo.name });

mqtthook.hook(config.mqtthook.topic).trigger(data => {
  ref.child('data').push({
      date: new Date().toUTCString(),
      pm2_5: data.pm2_5,
    },
    error => {
      config.debug && (error ? console.error(error.message) :
                               console.log(`PM2.5: ${data.pm2_5}`));
    });
});
