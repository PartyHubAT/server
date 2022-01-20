const mathUtil = require('../core/mathUtil')

/**
 * Allows interaction with rooms
 */
class RoomService {
  /**
   * The repo used to store and retrieve rooms
   * @type {RoomRepo}
   */
  #roomRepo = null
  /**
   * Used to manage the players in the rooms
   * @type {PlayerService}
   */
  #playerService = null

  /**
   * Initializes a new player-service
   * @param {RoomRepo} roomRepo The repo used to store and retrieve rooms
   * @param {PlayerService} playerService Used to manage the players in the rooms
   */
  constructor (roomRepo, playerService) {
    this.#roomRepo = roomRepo
    this.#playerService = playerService
  }

  /**
   * Generates a random room-id
   * @returns {RoomId} The id
   */
  static #generateRoomId () {
    // This does not check for duplicates
    return mathUtil.randBetween(100000, 999999)
  }

  /**
   * Gets a room by id
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<Room|undefined>} A promise of the room or undefined if the room was not found
   */
  async #getRoom (roomId) {
    return this.#roomRepo.getById(roomId)
  }

  /**
   * Gets the ids of all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<string[]>} The ids or an empty array if the room is not found
   */
  async #getPlayerIdsInRoom (roomId) {
    const room = await this.#getRoom(roomId)
    return room ? room.playerIds : []
  }

  /**
   * Gets the id of the host in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<String|undefined>} The id or undefined if the room is not found or empty
   */
  async #getHostId (roomId) {
    const ids = await this.#getPlayerIdsInRoom(roomId)
    return ids.length > 0
      ? ids[0] // The first player in the room is the host
      : undefined
  }

  /**
   * Gets the socket-room name of a room
   * @param {RoomId} roomId The id of the room
   * @returns {string} The socket-room name
   */
  getSocketRoomName (roomId) {
    return `Room-${roomId}`
  }

  /**
   * Gets the role of a specific player in a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise<string|undefined>} The role of the player or undefined if the room was not found or empty
   */
  async getPlayerRole (roomId, playerId) {
    const hostId = await this.#getHostId(roomId)
    return hostId ? (hostId === playerId ? 'HOST' : 'GUEST') : undefined
  }

  /**
   * Gets the name of the selected game in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<string|undefined>} The name of the game or undefined if the room was not found
   */
  async getSelectedGameName (roomId) {
    const room = await this.#getRoom(roomId)
    return room ? room.gameName : undefined
  }

  /**
   * Adds a player to a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise<void>}
   */
  async addPlayerToRoom (roomId, playerId) {
    const ids = await this.#getPlayerIdsInRoom(roomId)
    await this.#roomRepo.updateById(roomId, { playerIds: ids.concat(playerId) })
    await this.#playerService.joinRoom(playerId, roomId)
  }

  /**
   * Gets all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<(Player|undefined)[]>} The players or an empty array if the room is not found. Players may also be undefined if they are not found
   */
  async getPlayersInRoom (roomId) {
    const playerIds = await this.#getPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => this.#playerService.getPlayerById(id)))
  }

  /**
   * Gets the names of all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<(string|undefined)[]>} The names of the players or empty array if the room was not found
   */
  async getPlayerNamesInRoom (roomId) {
    const players = await this.getPlayersInRoom(roomId)
    return players.map(it => it?.name)
  }

  /**
   * Opens a new room with a specific player as host
   * @param {PlayerId} hostId The id of the host player
   * @returns {Promise<RoomId>} The id of the opened room
   */
  async openNewWithHost (hostId) {
    const roomId = RoomService.#generateRoomId()
    await this.#roomRepo.putNew({
      _id: roomId,
      gameName: '',
      playerIds: []
    })
    await this.addPlayerToRoom(roomId, hostId)
    return roomId
  }

  /**
   * Removes a player from a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise<void>}
   */
  async removePlayerFromRoom (roomId, playerId) {
    const ids = await this.#getPlayerIdsInRoom(roomId)
    await this.#roomRepo.updateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
  }

  /**
   * Selects a game in a room
   * @param {RoomId} roomId The id of the room
   * @param {string} gameName The name of the game to be selected
   * @returns {Promise<void>}
   */
  async selectGame (roomId, gameName) {
    await this.#roomRepo.updateById(roomId, { gameName })
  }
}

module.exports = RoomService
