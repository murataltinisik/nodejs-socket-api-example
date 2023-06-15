const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = new socket.Server(server);

app.use(express.static('public'));
let numberOfUsers = 0;

io.on("connection", (socket) => {
    console.log(numberOfUsers)

    socket.on('send-message', (data) => {
        numberOfUsers++;
        data.client_id = socket.id;
        io.sockets.emit("send-message", data, numberOfUsers);
    });

    socket.on('writing', (username) => {
         socket.broadcast.emit('writing', username);
    });

    socket.on('disconnect', () => {
        if(numberOfUsers > 0){
            numberOfUsers--;
        }else{
            numberOfUsers = 0;
        }
        console.log("Disconnect!!!");
    })
});

server.listen(3000, () => {
    console.log("Listening to port 3000");
});
