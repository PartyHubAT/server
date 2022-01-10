/**
 * Repository for interacting with games in the database
 * @param mongoose The mongoose instance on this server
 * @returns {{getAll(): Promise<Object[]>, putNew(Object): Promise<Object>}}
 */
module.exports = (mongoose) => {
  const Game = require('../dbmodels/Game.js')(mongoose)

  return {
    /**
     * Puts a new game into the database
     * @param {Object} game The game to put
     * @returns {Promise<Object>} The created game
     */
    async putNew (game) {
      return Game.create(game)
    },

    /**
     * Gets all games in the database
     * @returns {Promise<Object[]>}
     */
    async getAll () {
      return Game.find()
    }
  }
}
