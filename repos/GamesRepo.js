module.exports = (mongoose) => {
  const Game = require('../models/Game.js')(mongoose)

  return {
    async putNew (game) {
      return Game.create(game)
    },
    async getAll () {
      return Game.find()
    }
  }
}
