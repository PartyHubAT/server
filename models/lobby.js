const { randBetween } = require('../core/mathUtil.js')
const { List } = require('immutable')

module.exports = class Lobby {
  /**
   * The lobbies room-id
   * @type {number}
   */
  #roomId
  /**
   * The ids of the players in the lobby
   */
  #playerIds

  constructor (roomId, playerIds) {
    this.#roomId = roomId
    this.#playerIds = playerIds
  }

  /**
   * Opens a new lobby
   * @return {Lobby} A new lobby
   */
  static openNew () {
    const id = randBetween(100000, 999999)
    return new Lobby(id, List())
  }

  /**
   * The lobbies room-id
   * @return {number}
   */
  get roomId () {
    return this.#roomId
  }

  /**
   * Gets the ids of all player in the lobby
   * @return {string[]}
   */
  get playerIds () {
    return this.#playerIds.toArray()
  }

  /**
   * Adds a player to the lobby
   * @param {string} playerId The id of the player to add
   * @return {Lobby} A new lobby with the player added
   */
  addPlayer (playerId) {
    return new Lobby(this.#roomId, this.#playerIds.push(playerId))
  }
}
