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
   * @returns {Promise}
   */
  async putNew (room) {
    await this.#roomModel.create(room)
  }

  /**
   * Gets a specific room by id
   * @param {RoomId} id The id of the room
   * @returns {Promise<Room>} The room
   */
  async tryGetById (id) {
    return this.#roomModel.findById(id).exec()
  }

  /**
   * Updates a room in the database
   * @param {RoomId} id The id of the room
   * @param {Object} update The updated room data
   * @returns {Promise}
   */
  async tryUpdateById (id, update) {
    await this.#roomModel.findByIdAndUpdate(id, update)
  }

  /**
   * Gets the name of the selected game in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<GameName>} The name of the game
   */
  async tryGetSelectedGameName (roomId) {
    return this.#roomModel
      .findById(roomId)
      .select('gameName')
      .exec()
      .then(r => r.gameName)
  }

  /**
   * Gets the ids of all players in a room
   * @param {RoomId} roomId The id of the room
   * @returns {Promise<PlayerId[]>} The ids
   */
  async tryGetPlayerIdsInRoom (roomId) {
    return this.#roomModel
      .findById(roomId)
      .select('playerIds')
      .exec()
      .then(r => r.playerIds)
  }
}

module.exports = RoomRepo
