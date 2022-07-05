// example of mqtt client in js

// declare host, port, clientId, username, password
var hostname = "34.196.176.135";
var port = 8083;
var clientId = "webio4mqttexample";
clientId += new Date().getUTCMilliseconds();
var username = "RAMON_MQTT";
var password = "RAMON_MQTT";


// create the topics to subscribe and send status
// ESP32_1
var subBomb1 = "Casa_01/ESP32_1/Bomb1/Status";
var subBomb2 = "Casa_01/ESP32_1/Bomb2/Status";
// ESP32_2
var subRel1  = "Casa_01/ESP32_2/Rel1/Status";
var subTemp2 = "Casa_01/ESP32_2/Temp/Status";
var subHum2  = "Casa_01/ESP32_2/Hum/Status";
// ESP32_3
var subTemp3 = "Casa_01/ESP32_3/Temp/Status";
var subHum3  = "Casa_01/ESP32_3/Hum/Status";

// create and connect the mqtt client with paho
var mqttClient = new Paho.MQTT.Client(hostname, port, clientId);
mqttClient.onMessageArrived = MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

// function to connect to the mqtt broker
function Connect() {
    mqttClient.connect({
        onSuccess: Connected,
        onFailure: ConnectionFailed,
        keepAliveInterval: 10,
        userName: username,
        password: password
    });
}

// callback for successful connection
function Connected() {
    console.log("Conectado");
    mqttClient.subscribe(subBomb1);
    console.log("Subscripción 1 exitosa");
    mqttClient.subscribe(subBomb2);
    console.log("Subscripción 2 exitosa");
    mqttClient.subscribe(subRel1);
    console.log("Subscripción 3 exitosa");
    mqttClient.subscribe(subTemp2);
    console.log("Subscripción 4 exitosa");
    mqttClient.subscribe(subHum2);
    console.log("Subscripción 5 exitosa");
    mqttClient.subscribe(subTemp3);
    console.log("Subscripción 6 exitosa");
    mqttClient.subscribe(subHum3);
    console.log("Subscripción 7 exitosa");
}

// error on connection
function ConnectionFailed(res) {
    console.log("Connect failed:" + res.errorMessage);
}

// lost connection and reconnect
function ConnectionLost(res) {
    if (res.errorCode != 0) {
        console.log("Connection lost:" + res.errorMessage);
        Connect();
    }
}

// callback for message received
function MessageArrived(message) {
    console.log("Message arrived:" + message.payloadString);
    var topicSelected = message.destinationName;
    console.log(topic);

    // display message
    console.log("Message: "+topic);

    // action depending of the topic received
    // verify if the topic is a light or analog data
    var sensor = topicSelected.split("/");
    if (sensor[2] == "Temp" || sensor[2] == "Hum") {
        // read the data from dht11
        console.log("Sensor de temperatura o humedad: "+message.payloadString);
        // change the button value
        module.innerHTML = message.payloadString;
    } else {
        // get the set status of the light/relay
        var dataReceived = topicSelected.slice(-1);        

        // send the data to the mqtt broker
        var message = new Paho.MQTT.Message(dataReceived);
        message.destinationName = topicSelected;
        mqttClient.send(message);

        // toggle the text in button to on or off
        if (dataReceived == "1") {
            module.innerHTML = "ON";
            // change the id to send a different topic
            // module.id = topicSelected.replace("Set/1", "Set/0");
        } else {
            module.innerHTML = "OFF";
            // module.id = topicSelected.replace("Set/0", "Set/1");
        }
    }

}

function setData(module) {
    // get the topic to send
    console.log(module.id)
    var topicSelected = module.id;

    // verify if the topic is a light or analog data
    var sensor = topicSelected.split("/");
    if (sensor[2] == "Temp" || sensor[2] == "Hum") {
        alert("Sensor de temperatura o humedad");
    } else {
        // get the set status of the light/relay
        var dataReceived = topicSelected.slice(-1);        

        // send the data to the mqtt broker
        var message = new Paho.MQTT.Message(dataReceived);
        message.destinationName = topicSelected;
        mqttClient.send(message);

        // toggle the text in button to on or off
        if (dataReceived == "1") {
            // module.innerHTML = "ON";
            // change the id to send a different topic
            module.id = topicSelected.replace("Set/1", "Set/0");
        } else {
            // module.innerHTML = "OFF";
            module.id = topicSelected.replace("Set/0", "Set/1");
        }
    }
}
