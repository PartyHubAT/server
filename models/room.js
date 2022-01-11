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
  /**
   * The name of the currently selected game
   * @type {string}
   */
  #gameName

  constructor (id, playerIds, gameName) {
    this.#id = id
    this.#playerIds = playerIds
    this.#gameName = gameName
  }

  /**
   * Opens a new room
   * @return {Room} A new room
   */
  static openNew () {
    const id = randBetween(100000, 999999)
    return new Room(id, List(), '')
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
   * The name of the currently selected game
   * @return {string}
   */
  get gameName () {
    return this.#gameName
  }

  /**
   * Makes a new version of this room with the given players
   * @param playerIds The new player-ids
   * @return {Room} A new room with the new players
   */
  #withPlayers (playerIds) {
    return new Room(this.id, playerIds, this.gameName)
  }

  /**
   * Makes a new version of this room with the given game as its selected game
   * @param {string} gameName The name of the selected game
   * @return {Room} A new room with the changed game
   */
  withGameName (gameName) {
    return new Room(this.id, this.#playerIds, gameName)
  }

  /**
   * Adds a player to the room
   * @param {string} playerId The id of the player to add
   * @return {Room} A new room with the player added
   */
  addPlayer (playerId) {
    return this.#withPlayers(this.#playerIds.push(playerId))
  }

  /**
   * Removes a player from the room
   * @param {string} playerId The id of the player
   * @return {Room} The room without the player
   */
  removePlayer (playerId) {
    return this.#withPlayers(this.#playerIds.filter(it => it !== playerId))
  }
}
