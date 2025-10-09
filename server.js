const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const easyrtc = require('open-easyrtc');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from root directory
app.use(express.static(path.resolve(__dirname)));

// Initialize WebRTC
const myIceServers = [
  {"urls":"stun:stun1.l.google.com:19302"},
  {"urls":"stun:stun2.l.google.com:19302"}
];

easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Set up WebRTC listeners
easyrtc.events.on("easyrtcAuth", (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, (err, connectionObj) => {
        callback(err, connectionObj);
    });
});

easyrtc.events.on("roomJoin", (connectionObj, roomName, roomParameter, callback) => {
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
easyrtc.listen(app, server, null, (err, rtcRef) => {
    console.log("EasyRTC server started");
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});