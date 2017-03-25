'use strict';

var MQTThook = require('mqtthook');
var firebase = require('firebase-admin');

function Data2FirebaseMQTThook(params) {
  this._params = params;
  firebase.initializeApp({
    credential: firebase.credential.cert(params.databaseAuth),
    databaseURL: params.databaseURL,
  });
  var ref = firebase.database().ref(params.dataReferencePath);
  ref.child('info').set(params.deviceInfo);
  this._dataRef = ref;
  this._mqtthook = new MQTThook(params.mqtthook.brokerUrl, params.mqtthook.options);
}

Data2FirebaseMQTThook.prototype = {
  _params: null,
  _mqtthook: null,
  _dataRef: null,

  hook: function() {
    this._mqtthook.hook(this._params.mqtthook.topic).trigger(data => {
      // We always save the sensor data's datetime with server datetime.
      data = this._filter(data);
      data.datetime = new Date().toUTCString();
      this._dataRef.child('data').push(data, error => {
        this._params.debug && (error ? console.error(error.message) :
                                       console.log(`Data stored: ${JSON.stringify(data)}`));
      });
    });
  },

  _filter: function(_data) {
    if (!this._params.dataFilter) {
      return _data;
    }
    var data = {};
    for (var key in _data) {
      if (this._params.dataFilter[key]) {
        data[key] = _data[key];
      }
    }
    return data;
  },
};

module.exports = Data2FirebaseMQTThook;
