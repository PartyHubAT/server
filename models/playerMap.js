const { Map } = require('immutable')
const Player = require('./player.js')

/**
 * Stores players
 */
class PlayerMap {
  /**
   * All currently active players
   */
  #players

  constructor (players) {
    this.#players = players
  }

  /**
   * An empty player-map
   * @type {PlayerMap}
   */
  static empty = new PlayerMap(Map())

  /**
   * Adds a new lonely player to the player-map
   * @param {string} id The player id
   * @return {PlayerMap} A new player-map with the player added
   */
  addLonely (id) {
    const player = Player.makeLonely(id)
    return new PlayerMap(this.#players.set(id, player))
  }

  /**
   * Checks if a player exists in the player-map
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
   * Updates a player in the player-map
   * @param {string} id The id of the player
   * @param {function(Player):Player} mapper A function that changes a player
   * @return {PlayerMap} A new player-map with the new player
   */
  map (id, mapper) {
    const player = this.get(id)

    if (player) {
      const updated = mapper(player)
      return new PlayerMap(this.#players.set(id, updated))
    } else {
      return this
    }
  }

  /**
   * Changes the name of a player in the player-map. If the player does not exist, nothing happens
   * @param {string} id The id of the player
   * @param {string} name The new name
   * @return {PlayerMap} A new player-map with the updated player
   */
  setPlayerName (id, name) {
    return this.map(id, player => player.withName(name))
  }

  /**
   * Changes the room-id of a player in the player-map. If the player does not exist, nothing happens
   * @param {string} id The id of the player
   * @param {number} roomId The new roomId
   * @return {PlayerMap} A new player-map with the updated player
   */
  setPlayerRoomId (id, roomId) {
    return this.map(id, player => player.withRoomId(roomId))
  }

  /**
   * Removes a player from the player-map
   * @param {string} id The id of the player
   * @return {PlayerMap} A new player-map without the player
   */
  remove (id) {
    return new PlayerMap(this.#players.filter(p => p.id !== id))
  }
}

module.exports = PlayerMap
