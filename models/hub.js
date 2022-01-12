const Player = require('./player')
const { Map } = require('immutable')

/**
 * Players indexed by their id
 * @typedef {Map.<string,Player>} PlayerMap
 */

/**
 * Rooms indexed by their id
 * @typedef {Map.<number,Room>} RoomMap
 */

/**
 * Stores the current rooms and players
 */
class Hub {
  /**
   * The player-map
   * @type {PlayerMap}
   */
  #players
  /**
   * The current rooms
   * @type {RoomMap}
   */
  #rooms

  constructor (players, rooms) {
    this.#players = players
    this.#rooms = rooms
  }

  /**
   * An empty hub
   * @type {Hub}
   */
  static empty = new Hub(Map(), Map())

  /**
   * Creates a new hub with different players
   * @param {PlayerMap} players The new players
   * @return {Hub} A hub with new players
   */
  #withPlayers (players) {
    return new Hub(players, this.#rooms)
  }

  /**
   * Creates a new hub with different rooms
   * @param {RoomMap} rooms The new rooms
   * @return {Hub} A hub with the new rooms
   */
  #withRooms (rooms) {
    return new Hub(this.#players, rooms)
  }

  /**
   * Changes the hubs players
   * @param {function(PlayerMap):PlayerMap} mapper A function that changes the players
   * @return {Hub} A new hub with the changed players
   */
  #mapPlayers (mapper) {
    return this.#withPlayers(mapper(this.#players))
  }

  /**
   * Changes the hubs rooms
   * @param {function(RoomMap):RoomMap} mapper A function that changes the rooms
   * @return {Hub} A new hub with the changed rooms
   */
  #mapRooms (mapper) {
    return this.#withRooms(mapper(this.#rooms))
  }

  /**
   * Changes one of the hubs players
   * @param {string} id The id of the player
   * @param {function(Player):Player} mapper A function that changes a player
   * @return {Hub} A new hub with the changed player
   */
  #mapPlayer (id, mapper) {
    return this.#mapPlayers(it => it.update(id, mapper))
  }

  /**
   * Changes one of the hubs rooms
   * @param {number} id The id of the room
   * @param {function(Room):Room} mapper A function that changes a room
   * @return {Hub} A new hub with the changed room
   */
  #mapRoom (id, mapper) {
    return this.#mapRooms(it => it.update(id, mapper))
  }

  /**
   * Adds a new player to the hub
   * @param {Player} player The player to add
   * @return {Hub} A new hub with the player added
   */
  #addPlayer (player) {
    return this.#mapPlayers(it => it.set(player.id, player))
  }

  /**
   * Checks if the hub has a player with the given id
   * @param {string} id The id of the player
   * @return {boolean} Whether the hub has a player with the name
   */
  hasPlayerWithId (id) {
    return this.#players.has(id)
  }

  /**
   * Gets a player by their id
   * @param {string} id The id of the player
   * @return {Player|undefined} The player or undefined if not found
   */
  getPlayerById (id) {
    return this.#players.get(id)
  }

  /**
   * Adds a new lonely player to the hub
   * @param {string} playerId The players id
   * @return {Hub} A new hub with the player added
   */
  addLonely (playerId) {
    const player = Player.makeLonely(playerId)
    return this.#addPlayer(player)
  }

  /**
   * Renames a player
   * @param {string} id The id of the player
   * @param {string} newName The new name of the player
   * @return {Hub} A new hub with the renamed player
   */
  renamePlayer (id, newName) {
    return this.#mapPlayer(id, it => it.withName(newName))
  }

  /**
   * Adds a new room to this hub
   * @param {Room} room The room to add
   * @return {Hub} A new hub with the room added
   */
  addRoom (room) {
    return this.#mapRooms(it => it.set(room.id, room))
  }

  /**
   * Moves a player to a room
   * @param {string} playerId The id of the player
   * @param {number} roomId The id of the room
   * @return {Hub} A new hub with the moved player
   */
  movePlayerToRoom (playerId, roomId) {
    return this
      .#mapPlayer(playerId, it => it.withRoomId(roomId))
      .#mapRoom(roomId, it => it.addPlayer(playerId))
  }

  /**
   * Removes a player from the hub and all rooms they're in
   * @param {string} id The id of the player
   * @return {Hub} A new hub without the player
   */
  removePlayer (id) {
    const roomId = this.getPlayerById(id).roomId
    return (roomId
      ? this.#mapRoom(roomId, it => it.removePlayer(id))
      : this)
      .#mapPlayers(it => it.delete(id))
  }

  /**
   * Changes the game of a room
   * @param {number} roomId The id of the room
   * @param {string} gameName The name of the new game
   * @return {Hub} A new hub with the game changed
   */
  changeGameInRoom (roomId, gameName) {
    return this.#mapRoom(roomId, it => it.withGameName(gameName))
  }

  /**
   * Gets all players in a room
   * @param {number} roomId The id of the room
   * @return {Player[]|undefined} The players or undefined if the room is not found
   */
  getPlayersInRoom (roomId) {
    const room = this.#rooms.get(roomId)
    return room ? room.playerIds.map(id => this.getPlayerById(id)) : undefined
  }

  /**
   * Gets the names of all players in a room
   * @param {number} roomId The id of the room
   * @return {string[]|undefined} The names or undefined if the room was not found
   */
  getPlayerNamesInRoom (roomId) {
    const players = this.getPlayersInRoom(roomId)
    return players ? players.map(it => it.name) : undefined
  }

  /**
   * Gets a room by its id
   * @param {number} id The id of the room
   * @return {Room|undefined} The room or undefined if not found
   */
  getRoomById (id) {
    return this.#rooms.get(id)
  }

  /**
   * Gets the name of the game played in a room
   * @param {number} roomId The id of the room
   * @return {string|undefined} The name of the game or undefined if the room is not found
   */
  getGameInRoom (roomId) {
    const room = this.#rooms.get(roomId)
    return room ? room.gameName : undefined
  }

  /**
   * Gets the room a player is in
   * @param {string} playerId The id of the player
   * @return {Room|undefined} The room or undefined if the player was not found, is not in a room or the room was not found
   */
  getPlayersRoom (playerId) {
    const player = this.getPlayerById(playerId)
    const roomId = player?.roomId
    return roomId ? this.getRoomById(roomId) : undefined
  }

  /**
   * Gets the role of a player in a room
   * @param {string} playerId The id of the player
   * @return {string|undefined} The role or undefined if the room or player was not found
   */
  getPlayersRole (playerId) {
    const room = this.getPlayersRoom(playerId)
    if (room) {
      const playerIds = room.playerIds
      if (playerIds.includes(playerId)) {
        return playerIds[0] === playerId ? 'HOST' : 'GUEST'
      } else { return undefined }
    } else { return undefined }
  }
}

module.exports = Hub
