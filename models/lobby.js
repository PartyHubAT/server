const { randBetween } = require('../core/mathUtil.js')
const { Map } = require('immutable')

module.exports = class Lobby {
  /**
   * The lobbies room-id
   * @type {number}
   */
  #roomId
  /**
   * The players in the lobby
   */
  #players

  constructor (roomId, players) {
    this.#roomId = roomId
    this.#players = players
  }

  /**
   * Opens a new lobby
   * @return {Lobby} A new lobby
   */
  static openNew () {
    const id = randBetween(100000, 999999)
    return new Lobby(id, Map())
  }

  /**
   * The lobbies room-id
   * @return {number}
   */
  get roomId () {
    return this.#roomId
  }

  /**
   * Adds a player to the lobby
   * @param {Player} player The player to add
   * @return {Lobby} A new lobby with the player added
   */
  addPlayer (player) {
    return new Lobby(this.#roomId, this.#players.set(player.id, player))
  }
}
