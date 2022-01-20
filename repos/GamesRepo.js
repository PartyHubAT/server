/**
 * Repository for interacting with games in the database
 * @param mongoose The mongoose instance on this server
 * @returns {{getAll(): Promise<Game[]>, putNew(Game): Promise<Game>}}
 */
module.exports = (mongoose) => {
  const GameModel = require('../models/GameModel.js')(mongoose)

  return {
    /**
     * Puts a new game into the database
     * @param {Game} game The game to put
     * @returns {Promise<Game>} The created game
     */
    async putNew (game) {
      return GameModel.create(game)
    },

    /**
     * Gets all games in the database
     * @returns {Promise<Game[]>}
     */
    async getAll () {
      return GameModel.find()
    }
  }
}
