const moment = require('moment');
const {Player } = require('./Player');

class LiveGames {
    constructor () {
        this.games = [];
    }
    addGame(name){
        let pin = this.createPin();
        let live = false;
        let players = [];
        let hostId = null;
        let startedPlaying = null;
        let startedHosting = new moment();
        let game = {pin, live, name, players, hostId, startedHosting, startedPlaying};
        this.games.push(game);
        return game;
    }
    removeGame(pin){
        let game = this.getGame(pin);
        if(game){
            this.games = this.games.filter((game) => game.pin != pin);
        }
        return game;
    }
    getGame(pin){
        return this.games.filter((game) => game.pin == pin)[0];
    }
    getPlayers(pin){
        return this.getGame(pin).players;
    }
    startGame(pin){
        let g = this.games.filter(g => g.pin == pin)[0];
        if(g){
            g.live = true;
            g.startedPlaying = new moment(); 
        }
    }
    stopGame(pin){
        let g = this.games.filter(g => g.pin === pin)[0];
        if(g) g.live = false;
    }
    addPlayerToGame(player, pin){
        console.log(`pin search ${pin}`);
        console.log(`games search ${JSON.stringify(this.games)}`);
        let g = this.games.filter(g => g.pin === pin)[0];
        if(g) g.players.push(player);
    }
    removePlayerFromGame(socketId){
        let g = this.games.filter(function(game) {
            return game.players.some(player => player.socketId == socketId);
        })[0];
        if(g){
            let player = g.players.filter((player) => player.socketId == socketId)[0];
            player.pin = g.pin;
            g.players = g.players.filter((player) => player.socketId != socketId);
            return player;
        }
        
    }
    addHostToGame(socketId, pin){
        let g = this.games.filter(g => g.pin === pin)[0];
        if(g) g.hostId = socketId;
    }
    leftPadWithZeros(number, length){
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    createPin(pinLength = 4){
        let pin = Math.floor(Math.random() * 10000) + 1;
        pin = this.leftPadWithZeros(pin, pinLength);
        if(this.games.some(g => g.pin === pin)) return this.createPin(pinLength);
        return pin;
    }
}

module.exports = {LiveGames};