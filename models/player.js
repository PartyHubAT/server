/**
 * @typedef {string} PlayerId
 */

/**
 * A player
 */
class Player {
  /**
   * The players id
   * @type {PlayerId}
   */
  #id
  /**
   * The players name
   * @type {string}
   */
  #name
  /**
   * The id of the room the player is in
   * @type {RoomId|undefined}
   */
  #roomId

  constructor (id, name, roomId) {
    this.#id = id
    this.#name = name
    this.#roomId = roomId
  }

  /**
   * Creates a new lonely player
   * @param {PlayerId} id The players id
   * @return {Player} The created player
   */
  static makeLonely (id) {
    return new Player(id, 'unknown', undefined)
  }

  /**
   * The players id
   * @return {PlayerId}
   */
  get id () {
    return this.#id
  }

  /**
   * The players name
   * @return {string}
   */
  get name () {
    return this.#name
  }

  /**
   * Gets the id of the room the player is in
   * @return {RoomId|undefined} The id or undefined if the player is not in a room
   */
  get roomId () {
    return this.#roomId
  }

  /**
   * Checks if this player is in a room
   * @return {boolean} Whether the player is in a room or not
   */
  get inInRoom () {
    return this.roomId !== undefined
  }

  /**
   * Creates a new player with a different name
   * @param {string} name The new name
   * @return {Player} The new player
   */
  withName (name) {
    return new Player(this.#id, name, this.roomId)
  }

  /**
   * Creates a new player with a different room-id
   * @param {RoomId} roomId The new room-id
   * @return {Player} The new player
   */
  withRoomId (roomId) {
    return new Player(this.#id, this.name, roomId)
  }
}

module.exports = Player
