const mathUtil = require('../core/mathUtil')
const PlayerRole = require('../PlayerRole')

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
   * Gets the socket-room name of a room
   * @param {RoomId} roomId The id of the room
   * @returns {string} The socket-room name
   */
  static getSocketRoomName (roomId) {
    return `Room-${roomId}`
  }

  /**
   * Gets the id of the host in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<PlayerId>} The id
   */
  async #tryGetHostId (roomId) {
    const ids = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    return ids.length > 0
      ? ids[0] // The first player in the room is the host
      : undefined
  }

  /**
   * Gets the role of a specific player in a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise<PlayerRole>} The role of the player
   */
  async tryGetPlayerRole (roomId, playerId) {
    const hostId = await this.#tryGetHostId(roomId)
    return hostId ? (hostId === playerId ? PlayerRole.HOST : PlayerRole.GUEST) : undefined
  }

  /**
   * Gets the name of the selected game in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<GameName>} The name of the game
   */
  async tryGetSelectedGameName (roomId) {
    return this.#roomRepo.tryGetSelectedGameName(roomId)
  }

  /**
   * Adds a player to a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise}
   */
  async tryAddPlayerToRoom (roomId, playerId) {
    const ids = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    await this.#roomRepo.tryUpdateById(roomId, { playerIds: ids.concat(playerId) })
    await this.#playerService.tryJoinRoom(playerId, roomId)
  }

  /**
   * Gets all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<Player[]>} The players
   */
  async tryGetPlayersInRoom (roomId) {
    const playerIds = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => this.#playerService.tryGetPlayerById(id)))
  }

  /**
   * Gets the names of all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<(string|undefined)[]>} The names of the players or empty array if the room was not found
   */
  async tryGetPlayerNamesInRoom (roomId) {
    const players = await this.tryGetPlayersInRoom(roomId)
    return players.map(it => it?.name)
  }

  /**
   * Opens a new room with a specific player as host
   * @param {PlayerId} hostId The id of the host player
   * @returns {Promise<RoomId>} The id of the opened room
   */
  async tryOpenNewWithHost (hostId) {
    const roomId = RoomService.#generateRoomId()
    await this.#roomRepo.putNew({
      _id: roomId,
      gameName: '',
      playerIds: []
    })
    await this.tryAddPlayerToRoom(roomId, hostId)
    return roomId
  }

  /**
   * Removes a player from a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise<void>}
   */
  async tryRemovePlayerFromRoom (roomId, playerId) {
    const ids = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    await this.#roomRepo.tryUpdateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
  }

  /**
   * Selects a game in a room
   * @param {RoomId} roomId The id of the room
   * @param {GameName} gameName The name of the game to be selected
   * @returns {Promise<void>}
   */
  async trySelectGame (roomId, gameName) {
    await this.#roomRepo.tryUpdateById(roomId, { gameName })
  }
}

module.exports = RoomService
