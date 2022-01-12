/**
 * Repository for interacting with players in the database
 * @param mongoose The mongoose instance on this server
 * @returns {Object|{putNew(Object): Promise<Object>, getById(string): Promise<Object|undefined>, deleteById(string): Promise<void>, updateById(string, Object): Promise<void>}}
 */
module.exports = (mongoose) => {
  const Player = require('../dbmodels/Player.js')(mongoose)

  return {
    /**
     * Puts a new player into the database
     * @param {Object} player The player to put
     * @returns {Promise<Object>} The created player
     */
    async putNew (player) {
      return Player.create(player)
    },

    /**
     * Gets a player by id
     * @param {PlayerId} id The id of the player
     * @returns {Promise<Object|undefined>} The player or undefined if not found
     */
    async getById (id) {
      return Player.findById(id)
    },

    /**
     * Deletes a specific player
     * @param {PlayerId} id The id of the player to delete
     * @returns {Promise<void>}
     */
    async deleteById (id) {
      await Player.findByIdAndDelete(id)
    },

    /**
     * Updates a specific player in the database
     * @param {PlayerId} id The id of the player
     * @param {Object} update The new player data
     * @returns {Promise<void>}
     */
    async updateById (id, update) {
      await Player.findByIdAndUpdate(id, update)
    }
  }
}
