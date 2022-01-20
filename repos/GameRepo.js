/**
 * @typedef {Object} NewGame
 * @property {String} name
 */

/**
 * Stores and retrieves games
 */
class GameRepo {
  /**
   * Model of the game-type
   * @type {Model<Game>}
   */
  #gameModel = null

  /**
   * Initialize a new game-repo
   * @param {Mongoose} mongoose The mongoose instance used to connect to the database
   */
  constructor (mongoose) {
    this.#gameModel = require('../models/GameModel')(mongoose)
  }

  /**
   * Puts a new game into the database
   * @param {NewGame} newGame The game to add
   * @return {Promise<Game>}
   */
  async putNew (newGame) {
    return this.#gameModel.create(newGame)
  }

  /**
   * Gets all games from the database
   * @return {Promise<Game[]>}
   */
  async getAll () {
    return this.#gameModel.find({}).exec()
  }

  /**
   * Gets the names of all games from the database
   * @return {Promise<String[]>}
   */
  async getNamesOfAll () {
    return this.#gameModel
      .find({})
      .select('name')
      .exec()
      .then(games => games.map(g => g.name))
  }
}

module.exports = GameRepo
