/**
 * Repository for interacting with players in the database
 * @param mongoose The mongoose instance on this server
 * @returns {Object|{putNew(Object): Promise<Object>, getById(string): Promise<Object|undefined>, deleteById(string): Promise<void>, updateById(string, Object): Promise<void>}}
 */
module.exports = (mongoose) => {
  const PlayerModel = require('../models/PlayerModel.js')(mongoose)

  return {
    /**
     * Puts a new player into the database
     * @param {Player} player The player to put
     * @returns {Promise<Player>} The created player
     */
    async putNew (player) {
      return PlayerModel.create(player)
    },

    /**
     * Gets a player by id
     * @param {string} id The id of the player
     * @returns {Promise<Player|undefined>} The player or undefined if not found
     */
    async getById (id) {
      return PlayerModel.findById(id)
    },

    /**
     * Deletes a specific player
     * @param {string} id The id of the player to delete
     * @returns {Promise<void>}
     */
    async deleteById (id) {
      await PlayerModel.findByIdAndDelete(id)
    },

    /**
     * Updates a specific player in the database
     * @param {string} id The id of the player
     * @param {Player} update The new player data
     * @returns {Promise<void>}
     */
    async updateById (id, update) {
      await PlayerModel.findByIdAndUpdate(id, update)
    }
  }
}
