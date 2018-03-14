const MiFlora = require('node-mi-flora');

// initialize flora
let flora = new MiFlora();

// intialize Azure IoT Hub
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var connectionString = '[IoT device connection string]'; ////  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"

var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Client connected');

        // listen for data
        flora.on('data', function (data) {
            // DeviceData { deviceId: '1111', temperature: 25.2, lux: 5142, moisture: 46, fertility: 0 }
            console.log('data', data);

            // Create a message and send it to the IoT Hub every second
            var data = JSON.stringify(data);
            var message = new Message(data);
            //message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');

            console.log('Sending message: ' + message.getData());
            client.sendEvent(message, printResultFor('send'));
        }, 2000);

        // listen for device information
        flora.on('firmware', function (data) {
            // Firmware { deviceId: '1111', batteryLevel: 82, firmwareVersion: '2.6.2' }
            console.log('firmware', data);
        });

        flora.startScanning();

        // set an interval to rescan & get fresh data
        var flowerIntervall = setInterval(function () {
            console.log('every 15 seconds, rescan devices');
            flora.startScanning();
        }, 15000);

        client.on('error', function (err) {
            console.error(err.message);
        });

        client.on('disconnect', function () {
            clearInterval(flowerIntervall);

            flora.removeAllListeners();
            flora.stopScanning();

            client.removeAllListeners();
            client.open(connectCallback);
        });
    }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}