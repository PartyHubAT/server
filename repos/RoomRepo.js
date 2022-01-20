const RoomNotFoundError = require('../errors/RoomNotFoundError')

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
   * @async
   * @param {Room} room The room to put
   */
  async putNew (room) {
    await this.#roomModel.create(room)
  }

  /**
   * Gets a specific room by id
   * @async
   * @param {RoomId} id The id of the room
   * @returns {Room} The room
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryGetById (id) {
    return this.#roomModel.findById(id).exec()
      .catch(_ => { throw new RoomNotFoundError(id) })
  }

  /**
   * Updates a room in the database
   * @async
   * @param {RoomId} id The id of the room
   * @param {Object} update The updated room data
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryUpdateById (id, update) {
    await this.#roomModel.findByIdAndUpdate(id, update)
      .catch(_ => { throw new RoomNotFoundError(id) })
  }

  /**
   * Gets the name of the selected game in a room
   * @async
   * @param {RoomId} roomId The id of the room
   * @returns {GameName} The name of the game
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryGetSelectedGameName (roomId) {
    return this.#roomModel
      .findById(roomId)
      .select('gameName')
      .exec()
      .then(r => r.gameName)
      .catch(_ => { throw new RoomNotFoundError(roomId) })
  }

  /**
   * Gets the ids of all players in a room
   * @async
   * @param {RoomId} roomId The id of the room
   * @returns {PlayerId[]} The ids
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryGetPlayerIdsInRoom (roomId) {
    return this.#roomModel
      .findById(roomId)
      .select('playerIds')
      .exec()
      .then(r => r.playerIds)
      .catch(_ => { throw new RoomNotFoundError(roomId) })
  }
}

module.exports = RoomRepo
