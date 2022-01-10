const Player = require('./player.js')
const { Map } = require('immutable')

module.exports = class LonelyZone {
  /**
   * The players in the zone
   */
  #players

  constructor (players) {
    this.#players = players
  }

  /**
   * An empty lonely-zone
   * @type {LonelyZone}
   */
  static empty = new LonelyZone(Map())

  /**
   * Creates a new player and adds them to the lonely-zone
   * @param {string} playerId The id of the player
   * @return {LonelyZone} A new lonely-zone with the player added
   */
  addNew (playerId) {
    return new LonelyZone(this.#players.set(playerId, Player.makeUnknown(playerId)))
  }

  /**
   * Removes a player from the lonely-zone
   * @param {string} playerId The id of the player
   * @return {LonelyZone} A new lonely-zone without the player
   */
  remove (playerId) {
    return new LonelyZone(this.#players.delete(playerId))
  }

  /**
   * Checks if a player with the given id is in the lonely-zone
   * @param {string} playerId The id of the player
   * @return {boolean} Whether a player with the given if is in the lonely-zone
   */
  has (playerId) {
    return this.#players.has(playerId)
  }
}
