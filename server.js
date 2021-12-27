//Import dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { gatewayIp } = require('./utils/ip');
const { LiveGames } = require('./utils/LiveGames');

const publicPath = path.join(__dirname, 'public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var liveGames = new LiveGames();

app.use(express.static(publicPath));

//Starting server on port 3000
server.listen(3000, () => {
    console.log("Server started on port 3000");
});

io.on('connection', (socket) => {
    console.log(`Connected ${socket.id}`);

    socket.on('startHost', function (data) {
        console.log(`start hosting ${data.game}`);
        let game = liveGames.addGame(data.game, socket.id);
        socket.join(`${game.pin}-host`);
        socket.emit('hostPin', {game: game, ip:gatewayIp});
    });

    socket.on('joinPlayer', function (data){
        console.log('joinplayer');
        console.log(data);
        console.log(liveGames.games);
        socket.join(data.pin);
        liveGames.addPlayerToGame(data.player, socket.id, data.pin);
        socket.to(`${data.pin}-host`).emit('updatePlayers',liveGames.getPlayers(data.pin));
        console.log('player joined game');
    });

    socket.on('disconnect', () =>{
        console.log(`Disconnected ${socket.id}`);
    });

    socket.on('updatePlayers', function(data){
        socket.to(data.pin).emit('updatePlayers',data);
    });

    socket.on('updateHost', function(data){
        socket.to(`${data.pin}-host`).emit('updatePlayers',data);
    });

    socket.on('readDatabase', function(data){
        socket.to(`${data.pin}-host`).emit('updatePlayers',data);
    });

});



app.get('/join/:game/:pin', (req, res)=>{
    console.log(req.params.pin);
    res.sendFile(publicPath + '/join.html');
});

app.get('/exposed', (req, res)=>{
    res.sendFile(publicPath + '/exposed/index.html');
});