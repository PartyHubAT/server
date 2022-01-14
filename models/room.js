const { randBetween } = require('../misc/mathUtil')
const { List } = require('immutable')
const RoomPhase = require('./roomPhase')

/**
 * @typedef {number} RoomId
 */

/**
 * A room
 */
class Room {
  /**
   * The rooms id
   * @type {RoomId}
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
  /**
   * The phase the room is in
   * @type {RoomPhase}
   */
  #phase

  constructor (id, playerIds, gameName, phase) {
    this.#id = id
    this.#playerIds = playerIds
    this.#gameName = gameName
    this.#phase = phase
  }

  /**
   * Opens a new room
   * @return {Room} A new room
   */
  static openNew () {
    const id = randBetween(100000, 999999)
    return new Room(id, List(), '', RoomPhase.LOBBY)
  }

  /**
   * The rooms id
   * @return {RoomId}
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
   * The current phase
   * @return {RoomPhase}
   */
  get phase () {
    return this.#phase
  }

  /**
   * Makes a new version of this room with the given players
   * @param playerIds The new player-ids
   * @return {Room} A new room with the new players
   */
  #withPlayers (playerIds) {
    return new Room(this.id, playerIds, this.gameName, this.phase)
  }

  /**
   * Makes a new version of this room with the given game as its selected game
   * @param {string} gameName The name of the selected game
   * @return {Room} A new room with the changed game
   */
  withGameName (gameName) {
    return new Room(this.id, this.#playerIds, gameName, this.phase)
  }

  /**
   * Makes a new version of this room with the phase
   * @param {RoomPhase} phase The new phase
   * @return {Room} A new room with the changed phase
   */
  withPhase (phase) {
    return new Room(this.id, this.#playerIds, this.gameName, phase)
  }

  /**
   * Adds a player to the room
   * @param {PlayerId} playerId The id of the player to add
   * @return {Room} A new room with the player added
   */
  addPlayer (playerId) {
    return this.#withPlayers(this.#playerIds.push(playerId))
  }

  /**
   * Removes a player from the room
   * @param {PlayerId} playerId The id of the player
   * @return {Room} The room without the player
   */
  removePlayer (playerId) {
    return this.#withPlayers(this.#playerIds.filter(it => it !== playerId))
  }
}

module.exports = Room
