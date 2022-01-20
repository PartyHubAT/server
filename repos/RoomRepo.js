/**
 * Stores and retrieves rooms
 */
class RoomRepo {
  /**
   * Model of the room-type
   * @type {Model<Room>}
   */
  #roomModel = null

  /**
   * Initialize a new room-repo
   * @param {Mongoose} mongoose The mongoose instance used to connect to the database
   */
  constructor (mongoose) {
    this.#roomModel = require('../models/RoomModel')(mongoose)
  }

  /**
   * Puts a new room into the database
   * @param {Room} room The room to put
   * @returns {Promise<void>}
   */
  async putNew (room) {
    await this.#roomModel.create(room)
  }

  /**
   * Gets a specific room by id
   * @param {RoomId} id The id of the room
   * @returns {Promise<Room|undefined>} The room or undefined if not found
   */
  async getById (id) {
    return this.#roomModel.findById(id).exec()
  }

  /**
   * Updates a room in the database
   * @param {RoomId} id The id of the room
   * @param {Object} update The updated room data
   * @returns {Promise<void>}
   */
  async updateById (id, update) {
    await this.#roomModel.findByIdAndUpdate(id, update)
  }
}

module.exports = RoomRepo
