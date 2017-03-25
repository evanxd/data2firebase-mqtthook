# Data2Firebase MQTThook
A [MQTThook][mqtthook] to store sensors data from an IoT device in a [Firebase][firebase] database.

## How-to
Setup the MQTThook to store sensor data in the Firebase database.
```js
var Data2FirebaseMQTThook = require('data2firebase-mqtthook');
var params = {
  databaseURL: "https://your-project-id.firebaseio.com",
  dataReferencePath: "your/data/reference/path",
  mqtthook: {
    brokerUrl: "mqtt://test.mosquitto.org",
    topic: "hooked-topic"
  },
  deviceInfo: {
    name: "Your device name"
  },
}
var hook = new Data2FirebaseMQTThook(params);
hook.hook();
```

[mqtthook]: https://github.com/evanxd/mqtthook
[firebase]: https://firebase.google.com
