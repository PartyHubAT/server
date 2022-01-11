const { randBetween } = require('../core/mathUtil.js')
const { List } = require('immutable')

module.exports = class Room {
  /**
   * The rooms id
   * @type {number}
   */
  #id
  /**
   * The ids of the players in the room
   */
  #playerIds

  constructor (id, playerIds) {
    this.#id = id
    this.#playerIds = playerIds
  }

  /**
   * Opens a new room
   * @return {Room} A new room
   */
  static openNew () {
    const id = randBetween(100000, 999999)
    return new Room(id, List())
  }

  /**
   * The rooms id
   * @return {number}
   */
  get id () {
    return this.#id
  }

  /**
   * Gets the ids of all player in the room
   * @return {string[]}
   */
  get playerIds () {
    return this.#playerIds.toArray()
  }

  /**
   * Adds a player to the room
   * @param {string} playerId The id of the player to add
   * @return {Room} A new room with the player added
   */
  addPlayer (playerId) {
    return new Room(this.#id, this.#playerIds.push(playerId))
  }

  /**
   * Removes a player from the room
   * @param {string} playerId The id of the player
   * @return {Room} The room without the player
   */
  removePlayer (playerId) {
    return new Room(this.#id, this.#playerIds.filter(it => it !== playerId))
  }
}
