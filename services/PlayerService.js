/**
 * Service for interacting with rooms
 * @param repo Player-repo, for storing and retrieving players
 * @returns {{joinRoom(string, number): Promise<void>, getPlayerById(string): Promise<*|undefined>, createNew(string, string): Promise<*>, remove(string): Promise<*>}|Promise<*>|Promise<*>|Promise<*>|*|Promise<void>}
 */
module.exports = (repo) => {
  return {
    /**
     * Creates a new player
     * @param {PlayerId} id The id of the new player
     * @param {string} name The name of the new player
     * @returns {Promise<any>} The created player
     */
    async createNew (id, name) {
      const player = await repo.putNew({
        _id: id,
        name: name,
        roomId: undefined
      })
      return player._id
    },

    /**
     * Gets a player by id
     * @param {PlayerId} id The id of the player
     * @returns {Promise<any|undefined>} The player or undefined if not found
     */
    async getPlayerById (id) {
      try {
        const player = await repo.getById(id)
        return {
          _id: player._id,
          name: player.name,
          roomId: player.roomId
        }
      } catch (e) {
        return undefined
      }
    },

    /**
     * Sets a players room
     * @param {PlayerId} id The id of the player
     * @param {RoomId} roomId The id of the room
     * @returns {Promise<void>}
     */
    async joinRoom (id, roomId) {
      return repo.updateById(id, { roomId })
    },

    /**
     * Removes a player
     * @param {PlayerId} id The id of the player
     * @returns {Promise<*>}
     */
    async remove (id) {
      return repo.deleteById(id)
    }
  }
}
