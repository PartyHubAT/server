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
   * @throws {RoomNotFoundError} When no room with the given id was found
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
   * @throws {RoomNotFoundError} When no room with the given id was found
   */
  async tryGetPlayerRole (roomId, playerId) {
    const hostId = await this.#tryGetHostId(roomId)
    return hostId ? (hostId === playerId ? PlayerRole.HOST : PlayerRole.GUEST) : undefined
  }

  /**
   * Gets the name of the selected game in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<GameName>} The name of the game
   * @throws {RoomNotFoundError} When no room with the given id was found
   */
  async tryGetSelectedGameName (roomId) {
    return this.#roomRepo.tryGetSelectedGameName(roomId)
  }

  /**
   * Adds a player to a room
   * @param {RoomId} roomId The id of the room
   * @param {PlayerId} playerId The id of the player
   * @returns {Promise}
   * @throws {RoomNotFoundError} When no room with the given id was found
   * @throws {PlayerNotFoundError} When no player with the given id was found
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
   * @throws {RoomNotFoundError} When no room with the given id was found
   * @throws {PlayerNotFoundError} When no player could be found for any of the ids in the room
   */
  async tryGetPlayersInRoom (roomId) {
    const playerIds = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => this.#playerService.tryGetPlayerById(id)))
  }

  /**
   * Gets the names of all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<string[]>} The names of the players
   * @throws {RoomNotFoundError} When no room with the given id was found
   * @throws {PlayerNotFoundError} When no player could be found for any of the ids in the room
   */
  async tryGetPlayerNamesInRoom (roomId) {
    const players = await this.tryGetPlayersInRoom(roomId)
    return players.map(it => it?.name)
  }

  /**
   * Gets the room with a certain id
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<Room>} The certain room
   * @throws {RoomNotFoundError} When no room with the given id was found
   */
  async tryGetRoom (roomId) {
    return await this.#roomRepo.tryGetById(roomId)
  }

  /**
   * Opens a new room with a specific player as host
   * @param {PlayerId} hostId The id of the host player
   * @returns {Promise<RoomId>} The id of the opened room
   * @throws {PlayerNotFoundError} When no player with the given id was found
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
   * @returns {Promise}
   * @throws {RoomNotFoundError} When no room with the given id was found
   */
  async tryRemovePlayerFromRoom (roomId, playerId) {
    const ids = await this.#roomRepo.tryGetPlayerIdsInRoom(roomId)
    await this.#roomRepo.tryUpdateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
  }

  /**
   * Selects a game in a room
   * @param {RoomId} roomId The id of the room
   * @param {GameName} gameName The name of the game to be selected
   * @returns {Promise}
   * @throws {RoomNotFoundError} When no room with the given id was found
   */
  async trySelectGame (roomId, gameName) {
    await this.#roomRepo.tryUpdateById(roomId, { gameName })
  }
}

module.exports = RoomService
