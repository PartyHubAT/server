const {Player } = require('./Player');

class LiveGames {
    constructor () {
        this.games = [];
    }
    addGame(name, socketId){
        let pin = this.createPin();
        let live = false;
        let players = [];
        let hostId = socketId;
        let game = {pin, live, name, hostId, players};
        this.games.push(game);
        return game;
    }
    removeGame(pin){
        let game = this.getGame(pin);
        if(game){
            this.games = this.games.filter((game) => game.pin !== pin);
        }
        return game;
    }
    getGame(pin){
        return this.games.find((game) => game.pin === pin);
    }
    getPlayers(pin){
        let players = [];
        players = this.games.find(g => g.pin === pin).players;
        return players;
    }
    startGame(pin){
        let g = this.games.find(g => g.pin === pin);
        if(g) g.live = true;
    }
    addPlayerToGame(player, pin){
        console.log(`pin search ${pin}`);
        console.log(`games search ${JSON.stringify(this.games)}`);
        let g = this.games.find(g => g.pin === pin);
        if(g) g.players.push(player);
    }
    removePlayerFromGame(removePlayer,pin){
        let g = this.games.find(g => g.pin == pin);
        if(g) g.players = g.players.filter((player) => player.socketId !== removePlayer.socketId);
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
        if(this.games.some(g => g.pin === pin)) return;
        return pin;
    }
}

module.exports = {LiveGames};