const PlayerNotFoundError = require('../errors/PlayerNotFoundError')

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
   * @async
   * @param {Player} player The player to put
   */
  async putNew (player) {
    await this.#playerModel.create(player)
  }

  /**
   * Gets a player by their id
   * @async
   * @param {PlayerId} id The id of the player
   * @returns {Player} The player
   * @throws {PlayerNotFoundError} The player with the given id was not found
   */
  async tryGetById (id) {
    return this.#playerModel.findById(id).exec()
      .catch(_ => { throw new PlayerNotFoundError(id) })
  }

  /**
   * Deletes a specific player
   * @async
   * @param {PlayerId} id The id of the player to delete
   * @throws {PlayerNotFoundError} The player with the given id was not found
   */
  async tryDeleteById (id) {
    await this.#playerModel.findByIdAndDelete(id).exec()
      .catch(_ => { throw new PlayerNotFoundError(id) })
  }

  /**
   * Updates a specific player in the database
   * @async
   * @param {PlayerId} id The id of the player
   * @param {Object} update The new player data
   * @throws {PlayerNotFoundError} The player with the given id was not found
   */
  async tryUpdateById (id, update) {
    await this.#playerModel.findByIdAndUpdate(id, update).exec()
      .catch(_ => { throw new PlayerNotFoundError(id) })
  }
}

module.exports = PlayerRepo
