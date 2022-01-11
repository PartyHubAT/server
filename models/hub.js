const PlayerMap = require('./playerMap.js')
const RoomMap = require('./roomMap.js')
const Room = require('./room.js')

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

  constructor (playerMap, rooms) {
    this.#players = playerMap
    this.#rooms = rooms
  }

  /**
   * An empty hub
   * @type {Hub}
   */
  static empty = new Hub(PlayerMap.empty, RoomMap.empty)

  /**
   * The hubs players
   * @return {PlayerMap}
   */
  get players () {
    return this.#players
  }

  /**
   * The hubs' rooms
   * @return {RoomMap}
   */
  get rooms () {
    return this.#rooms
  }

  /**
   * Creates a new hub with a different player-map
   * @param {PlayerMap} playerMap The new player-map
   * @return {Hub} A hub with the new player-map
   */
  withPlayers (playerMap) {
    return new Hub(playerMap, this.rooms)
  }

  /**
   * Creates a new hub with different rooms
   * @param {RoomMap} rooms The new rooms
   * @return {Hub} A hub with the new rooms
   */
  withRooms (rooms) {
    return new Hub(this.players, rooms)
  }

  /**
   * Changes the hubs player-map
   * @param {function(PlayerMap):PlayerMap} mapper A function that changes the player-map
   * @return {Hub} A new hub with the changed player-map
   */
  mapPlayers (mapper) {
    return this.withPlayers(mapper(this.players))
  }

  /**
   * Changes the hubs rooms
   * @param {function(RoomMap):RoomMap} mapper A function that changes the rooms
   * @return {Hub} A new hub with the changed rooms
   */
  mapRooms (mapper) {
    return this.withRooms(mapper(this.rooms))
  }

  /**
   * Changes one of the hubs rooms
   * @param {number} id The id of the room
   * @param {function(Room):Room} mapper A function that changes a room
   * @return {Hub} A new hub with the changed room
   */
  mapRoom (id, mapper) {
    return this.mapRooms(rooms => rooms.map(id, mapper))
  }

  /**
   * Gets all players in a room
   * @param {number} roomId The id of the room
   * @return {Player[]|undefined} The players or undefined if the room is not found
   */
  getPlayersInRoom (roomId) {
    const room = this.rooms.get(roomId)
    return room ? room.playerIds.map(id => this.players.get(id)) : undefined
  }

  /**
   * Gets the role of a player in a room
   * @param {string} playerId The id of the player
   * @param {number} roomId The id of the room
   * @return {string|undefined} The role or undefined if the room or player was not found
   */
  getPlayerRoleInRoom (playerId, roomId) {
    const room = this.rooms.get(roomId)
    if (room) {
      const playerIds = room.playerIds
      if (playerIds.includes(playerId)) {
        return playerIds[0] === playerId ? 'HOST' : 'GUEST'
      } else { return undefined }
    } else { return undefined }
  }
}

module.exports = Hub
