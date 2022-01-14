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
  /**
   * Whether the player has set up the game yet
   * @type {boolean}
   */
  #hasSetupGame

  constructor (id, name, roomId, hasSetupGame) {
    this.#id = id
    this.#name = name
    this.#roomId = roomId
    this.#hasSetupGame = hasSetupGame
  }

  /**
   * Creates a new lonely player
   * @param {PlayerId} id The players id
   * @return {Player} The created player
   */
  static makeLonely (id) {
    return new Player(id, 'unknown', undefined, false)
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
   * Whether the player has set up the game
   * @return {boolean}
   */
  get hasSetupGame () {
    return this.#hasSetupGame
  }

  /**
   * Creates a new player with a different name
   * @param {string} name The new name
   * @return {Player} The new player
   */
  withName (name) {
    return new Player(this.id, name, this.roomId, this.hasSetupGame)
  }

  /**
   * Creates a new player with a different room-id
   * @param {RoomId} roomId The new room-id
   * @return {Player} The new player
   */
  withRoomId (roomId) {
    return new Player(this.id, this.name, roomId, this.hasSetupGame)
  }

  /**
   * Changes whether the player has set up their game
   * @param {boolean} hasSetupGame Whether the player has set up their game
   * @return {Player} A new player with the hasSetupGame flag changed
   */
  withSetupGame (hasSetupGame) {
    return new Player(this.id, this.name, this.roomId, hasSetupGame)
  }
}

module.exports = Player
