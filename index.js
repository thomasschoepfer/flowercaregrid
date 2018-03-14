const MiFlora = require('node-mi-flora');

// initialize flora
let flora = new MiFlora();

// listen for data
flora.on('data', function (data) {
    console.log('data', data);
    // print DeviceData { deviceId: '1111', temperature: 25.2, lux: 5142, moisture: 46, fertility: 0 }
  });

// listen for device information
flora.on('firmware', function (data) {
    console.log('firmware', data);
    // print { deviceId: '1111', batteryLevel: 82, firmwareVersion: '2.6.2' }
  });

// set an interval to rescan & get fresh data
setInterval(function () {
  console.log('every 15 seconds, rescan devices');
  flora.startScanning();
}, 15000);

// stop scanning
flora.stopScanning();