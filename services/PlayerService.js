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
   * @param {PlayerId} id The id of the new player
   * @param {string} name The name of the new player
   * @returns {Promise}
   */
  async createNewPlayer (id, name) {
    await this.#playerRepo.putNew({
      _id: id,
      name: name,
      roomId: undefined,
      gameLoaded: false
    })
  }

  /**
   * Gets a player by id
   * @param {PlayerId} id The id of the player
   * @returns {Promise<Player>} The player
   */
  async tryGetPlayerById (id) {
    return this.#playerRepo.tryGetById(id)
  }

  /**
   * Sets a players room
   * @param {PlayerId} id The id of the player
   * @param {RoomId} roomId The id of the room
   * @returns {Promise}
   */
  async tryJoinRoom (id, roomId) {
    await this.#playerRepo.tryUpdateById(id, { roomId })
  }

  /**
   * Sets the flag of whether a player has their game loaded
   * @param {PlayerId} id The id of the player
   * @param {boolean} loaded Whether the player has their game loaded or not
   * @returns {Promise}
   */
  async trySetPlayerGameLoaded (id, loaded) {
    await this.#playerRepo.tryUpdateById(id, { gameLoaded: loaded })
  }

  /**
   * Removes a player
   * @param {PlayerId} id The id of the player
   * @returns {Promise}
   */
  async tryRemove (id) {
    await this.#playerRepo.tryDeleteById(id)
  }
}

module.exports = PlayerService
