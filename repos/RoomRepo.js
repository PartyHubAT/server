/**
 * Repository for interacting with rooms in the database
 * @param mongoose The mongoose instance on this server
 * @returns {{putNew(Object): Promise<Object>, getById(*): Promise<Object|undefined>, updateById(number, Object): Promise<void>}}
 */
module.exports = (mongoose) => {
  const Room = require('../models/Room.js')(mongoose)

  return {
    /**
     * Puts a new room into the database
     * @param {Object} room The room to put
     * @returns {Promise<Object>} The created room
     */
    async putNew (room) {
      return Room.create(room)
    },

    /**
     * Gets a specific room by id
     * @param id The id of the room
     * @returns {Promise<Object|undefined>} The room or undefined if not found
     */
    async getById (id) {
      return Room.findById(id)
    },

    /**
     * Updates a room in the database
     * @param {number} id The id of the room
     * @param {Object} update The updated room data
     * @returns {Promise<void>}
     */
    async updateById (id, update) {
      await Room.findByIdAndUpdate(id, update)
    }
  }
}
