const moment = require('moment');
const { Player } = require('./Player');

class LiveGames {
	constructor() {
		this.games = [];
	}
	addGame(name) {
		let gameId = this.createGameId();
		let live = false;
		let players = [];
		let hostId = null;
		let startedPlaying = null;
		let startedHosting = new moment();
		let game = { gameId, live, name, players, hostId, startedHosting, startedPlaying };
		this.games.push(game);
		return game;
	}
	removeGame(gameId) {
		let game = this.getGame(gameId);
		if (game) {
			this.games = this.games.filter((game) => game.gameId != gameId);
		}
		return game;
	}
	getGame(gameId) {
		return this.games.filter((game) => game.gameId == gameId)[0];
	}
	getPlayers(gameId) {
		return this.getGame(gameId).players;
	}
	startGame(gameId) {
		let g = this.games.filter((g) => g.gameId == gameId)[0];
		if (g) {
			g.live = true;
			g.startedPlaying = new moment();
		}
	}
	stopGame(gameId) {
		let g = this.games.filter((g) => g.gameId === gameId)[0];
		if (g) g.live = false;
	}
	addPlayerToGame(player, gameId) {
		console.log(`gameId search ${gameId}`);
		console.log(`games search ${JSON.stringify(this.games)}`);
		let g = this.games.filter((g) => g.gameId === gameId)[0];
		if (g) g.players.push(player);
	}
	removePlayerFromGame(playerId) {
		let g = this.games.filter(function(game) {
			return game.players.some((player) => player.playerId == playerId);
		})[0];
		if (g) {
			let player = g.players.filter((player) => player.playerId == playerId)[0];
			player.gameId = g.gameId;
			g.players = g.players.filter((player) => player.playerId != playerId);
			return player;
		}
	}
	addHostToGame(playerId, gameId) {
		let g = this.games.filter((g) => g.gameId === gameId)[0];
		if (g) g.hostId = playerId;
	}
	leftPadWithZeros(number, length) {
		let str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}
	createGameId(gameIdLength = 4) {
		let gameId = Math.floor(Math.random() * 10000) + 1;
		gameId = this.leftPadWithZeros(gameId, gameIdLength);
		if (this.games.some((g) => g.gameId === gameId)) return this.createGameId(gameIdLength);
		return gameId;
	}
}

module.exports = { LiveGames };
