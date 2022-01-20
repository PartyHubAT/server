/**
 * Stores and retrieves players
 */
class PlayerRepo {
  /**
   * Model of the player-type
   * @type {Model<Player>}
   */
  #playerModel = null

  /**
   * Initialize a new player-repo
   * @param {Mongoose} mongoose The mongoose instance used to connect to the database
   */
  constructor (mongoose) {
    this.#playerModel = require('../models/PlayerModel')(mongoose)
  }

  /**
   * Puts a new player into the database
   * @param {Player} player The player to put
   * @returns {Promise}
   */
  async putNew (player) {
    await this.#playerModel.create(player)
  }

  /**
   * Gets a player by their id
   * @param {PlayerId} id The id of the player
   * @returns {Promise<Player|undefined>} The player or undefined if not found
   */
  async getById (id) {
    return this.#playerModel.findById(id).exec()
  }

  /**
   * Deletes a specific player
   * @param {PlayerId} id The id of the player to delete
   * @returns {Promise<void>}
   */
  async deleteById (id) {
    await this.#playerModel.findByIdAndDelete(id).exec()
  }

  /**
   * Updates a specific player in the database
   * @param {PlayerId} id The id of the player
   * @param {Object} update The new player data
   * @returns {Promise<void>}
   */
  async updateById (id, update) {
    await this.#playerModel.findByIdAndUpdate(id, update).exec()
  }
}

module.exports = PlayerRepo
