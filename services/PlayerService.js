/**
 * Allows interaction with players
 */
class PlayerService {
  /**
   * The repo used to store and retrieve players
   * @type {PlayerRepo}
   */
  #playerRepo = null

  /**
   * Initializes a new player-service
   * @param {PlayerRepo} playerRepo The repo used to store and retrieve players
   */
  constructor (playerRepo) {
    this.#playerRepo = playerRepo
  }

  /**
   * Creates a new player
   * @param {string} id The id of the new player
   * @param {string} name The name of the new player
   * @returns {Promise<void>}
   */
  async createNew (id, name) {
    await this.#playerRepo.putNew({
      _id: id,
      name: name,
      roomId: undefined
    })
  }

  /**
   * Gets a player by id
   * @param {string} id The id of the player
   * @returns {Promise<Player|undefined>} The player or undefined if not found
   */
  async getPlayerById (id) {
    return this.#playerRepo.getById(id)
  }

  /**
   * Sets a players room
   * @param {string} id The id of the player
   * @param {number} roomId The id of the room
   * @returns {Promise<void>}
   */
  async joinRoom (id, roomId) {
    return this.#playerRepo.updateById(id, { roomId })
  }

  /**
   * Removes a player
   * @param {string} id The id of the player
   * @returns {Promise<void>}
   */
  async remove (id) {
    await this.#playerRepo.deleteById(id)
  }
}

module.exports = PlayerService
