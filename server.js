//Import dependencies
const config = require('./config.json');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { gatewayIp } = require('./utils/ip');
const { LiveGames } = require('./utils/LiveGames');
const { Player} = require('./utils/Player');

const publicPath = path.join(__dirname, 'public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var liveGames = new LiveGames();

app.use(express.static(publicPath));

//Starting server on port 3000
server.listen(3000, () => {
    console.log("PartyHub-Server started on port 3000");
});

io.on('connection', (socket) => {
    console.log(`Connected ${socket.id}`);

    socket.on('startLobby', function (data) {
        console.log(`start lobby for ${data.game}`);
        let game = liveGames.addGame(data.game);
        socket.join(`${game.pin}-host`);
        socket.emit('hostPin', {game: game, ip:gatewayIp});
    });

    socket.on('joinPlayer', function (data){
        socket.join(data.pin);
        liveGames.addPlayerToGame(new Player(socket.id,data.player), data.pin);
        socket.to(`${data.pin}-host`).emit('updateLobby',liveGames.getPlayers(data.pin));
        console.log(`Player ${data.player} (${socket.id})  joined ${data.pin}`);
    });

    socket.on('startGame', function(data){
        liveGames.startGame(data.pin);
        socket.emit('startGame',
        {
            players: liveGames.getPlayers(data.pin)
        });
        socket.broadcast.to(data.pin).emit('startGame',        
        {
            players: liveGames.getPlayers(data.pin)
        });
    });

    socket.on('messagePlayers', function(data){
        socket.to(`${data.pin}-players`).emit('messagePlayers',data);
    });

    socket.on('messageHost', function(data){
        socket.to(`${data.pin}-host`).emit('messageHost',data);
    });

    socket.on('readDatabase', function(data){
        socket.to(`${data.pin}-host`).emit('updatePlayers',data);
    });

    socket.on('disconnect', (data) =>{
        let playerLeft = liveGames.removePlayerFromGame(socket.id);
        if(playerLeft){
            socket.to(`${playerLeft.pin}-host`).emit('updateLobby',liveGames.getPlayers(playerLeft.pin));
            console.log(`Player ${playerLeft.name} (${socket.id}) left ${playerLeft.pin}`);
        }
    });

});

app.get('/join/:game/:pin', (req, res)=>{
    console.log(req.params.pin);
    res.sendFile(publicPath + '/join.html');
});

config.games.forEach(game => {
    app.get(`/player/${game.name}`, (req, res)=>{
        res.sendFile(publicPath + game.publicPlayer);
    });
    app.get(`/host/${game.name}`, (req, res)=>{
        res.sendFile(publicPath + game.publicHost);
    });
});