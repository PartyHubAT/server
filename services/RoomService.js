const mathUtil = require('../core/mathUtil')

/**
 * Service for interacting with rooms
 * @param repo Room-repo, for storing and retrieving rooms
 * @param playerService Player-service, for interacting with players
 * @returns {string|undefined|*[]|string|*|{getSelectedGameName(number): Promise<string|undefined>, getPlayerNamesInRoom(number): Promise<string[]>, getPlayerRole(number, string): Promise<string|undefined>, openNewWithHost(string): Promise<number>, selectGame(number, string): Promise<void>, removePlayerFromRoom(number, string): Promise<void>, getSocketRoomName(number): string, addPlayerToRoom(number, string): Promise<void>}}
 */
module.exports = (repo, playerService) => {
  /**
   * Generates a random room-id
   * @returns {number} The id
   */
  function generateRoomId () {
    // This does not check for duplicates
    return mathUtil.randBetween(10000, 999999)
  }

  /**
   * Gets a room by id
   * @param {number} roomId The id of the room
   * @returns {Promise<any|undefined>} A promise of the room or undefined if the room was not found
   */
  async function getRoom (roomId) {
    return repo.getById(roomId)
  }

  /**
   * Gets the ids of all players in a room
   * @param {number} roomId The id of the room
   * @returns {Promise<Number[]>} The ids or an empty array if the room is not found
   */
  async function getPlayerIdsInRoom (roomId) {
    const room = await getRoom(roomId)
    return room ? room.playerIds : []
  }

  /**
   * Gets all players in a room
   * @param {number} roomId The id of the room
   * @returns {Promise<any[]>} The players or an empty array if the room is not found
   */
  async function getPlayersInRoom (roomId) {
    const playerIds = await getPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => playerService.getPlayerById(id)))
  }

  /**
   * Gets the id of the host in a room
   * @param {number} roomId The id of the room
   * @returns {Promise<String|undefined>} The id or undefined if the room is not found or empty
   */
  async function getHostId (roomId) {
    const ids = await getPlayerIdsInRoom(roomId)
    return ids.length > 0
      ? ids[0] // The first player in the room is the host
      : undefined
  }

  return {
    /**
     * Gets the socket-room name of a room
     * @param {number} roomId The id of the room
     * @returns {string} The socket-room name
     */
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },

    /**
     * Gets the role of a specific player in a room
     * @param {number} roomId The id of the room
     * @param {string} playerId The id of the player
     * @returns {Promise<string|undefined>} The role of the player or undefined if the room was not found or empty
     */
    async getPlayerRole (roomId, playerId) {
      const hostId = await getHostId(roomId)
      return hostId ? (hostId === playerId ? 'HOST' : 'GUEST') : undefined
    },

    /**
     * Gets the name of the selected game in a room
     * @param {number} roomId The id of the room
     * @returns {Promise<string|undefined>} The name of the game or undefined if the room was not found
     */
    async getSelectedGameName (roomId) {
      const room = await getRoom(roomId)
      return room ? room.gameName : undefined
    },

    /**
     * Adds a player to a room
     * @param {number} roomId The id of the room
     * @param {string} playerId The id of the player
     * @returns {Promise<void>}
     */
    async addPlayerToRoom (roomId, playerId) {
      const ids = await getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.concat(playerId) })
      await playerService.joinRoom(playerId, roomId)
    },

    /**
     * Gets the names of all players in a room
     * @param {number} roomId The id of the room
     * @returns {Promise<string[]>} The names of the players or empty array if the room was not found
     */
    async getPlayerNamesInRoom (roomId) {
      const players = await getPlayersInRoom(roomId)
      return players.map(it => it.name)
    },

    /**
     * Opens a new room with a specific player as host
     * @param {string} hostId The id of the host player
     * @returns {Promise<number>} The id of the opened room
     */
    async openNewWithHost (hostId) {
      const roomId = (await repo.putNew({
        _id: generateRoomId(),
        gameName: '',
        playerIds: []
      }))._id
      await this.addPlayerToRoom(roomId, hostId)
      return roomId
    },

    /**
     * Removes a player from a room
     * @param {number} roomId The id of the room
     * @param {string} playerId The id of the player
     * @returns {Promise<void>}
     */
    async removePlayerFromRoom (roomId, playerId) {
      const ids = await getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
    },

    /**
     * Selects a game in a room
     * @param {number} roomId The id of the room
     * @param {string} gameName The name of the game to be selected
     * @returns {Promise<void>}
     */
    async selectGame (roomId, gameName) {
      await repo.updateById(roomId, { gameName })
    }
  }
}
