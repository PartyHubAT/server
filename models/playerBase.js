const { Map } = require('immutable')
const Player = require('./player.js')

module.exports = class PlayerBase {
  /**
   * All currently active players
   */
  #players

  constructor (players) {
    this.#players = players
  }

  /**
   * An empty player-base
   * @type {PlayerBase}
   */
  static empty = new PlayerBase(Map())

  /**
   * Adds a new lonely player to the player-base
   * @param {string} id The player id
   * @return {PlayerBase} A new player-base with the player added
   */
  addLonely (id) {
    const player = Player.makeLonely(id)
    return new PlayerBase(this.#players.set(id, player))
  }

  /**
   * Checks if a player exists in the player-base
   * @param {string} id The id of the player
   * @return {boolean} Whether the player exists or not
   */
  has (id) {
    return this.#players.has(id)
  }

  /**
   * Gets a player by their id
   * @param {string} id The id of the player
   * @return {Player|undefined} The player with the given id, or undefined if not found
   */
  get (id) {
    return this.#players.get(id)
  }

  /**
   * Updates a player in the player-base
   * @param {string} id The id of the player
   * @param {function} mapper A function that changes a player
   * @return {PlayerBase} A new player-base with the new player
   */
  #updatePlayer (id, mapper) {
    const player = this.get(id)

    if (player) {
      const updated = mapper(player)
      return new PlayerBase(this.#players.set(id, updated))
    } else {
      return this
    }
  }

  /**
   * Changes the name of a player in the player-base. If the player does not exist, nothing happens
   * @param {string} id The id of the player
   * @param {string} name The new name
   * @return {PlayerBase} A new player-base with the updated player
   */
  setPlayerName (id, name) {
    return this.#updatePlayer(id, player => player.withName(name))
  }

  /**
   * Changes the room-id of a player in the player-base. If the player does not exist, nothing happens
   * @param {string} id The id of the player
   * @param {number} roomId The new roomId
   * @return {PlayerBase} A new player-base with the updated player
   */
  setPlayerRoomId (id, roomId) {
    return this.#updatePlayer(id, player => player.withRoomId(roomId))
  }

  /**
   * Removes a player from the player-base
   * @param {string} id The id of the player
   * @return {PlayerBase} A new player-base without the player
   */
  remove (id) {
    return new PlayerBase(this.#players.filter(p => p.id !== id))
  }
}
