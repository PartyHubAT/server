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
        return this.games.filter((game) => game.pin === pin)[0]
    }
    getPlayers(pin){
        let players = [];
        players = this.games.filter(g => g.pin == pin)[0].players;
        return players;
    }
    startGame(pin){
        
    }
    addPlayerToGame(playername, socketId, pin){
        console.log(`pin search ${pin}`);
        console.log(`games search ${JSON.stringify(this.games)}`);
        let player = new Player(socketId, playername);
        let g = this.games.filter(g => g.pin == pin)[0];
        if(g) g.players.push(player);
        console.log(JSON.stringify(this.games));
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