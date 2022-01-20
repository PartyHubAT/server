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
   * @param {module:mongoose} mongoose The mongoose instance used to connect to the database
   */
  constructor (mongoose) {
    this.#roomModel = require('../models/RoomModel')(mongoose)
  }

  /**
   * Puts a new room into the database
   * @param {Promise<Room>} room The room to put
   */
  async putNew (room) {
    await this.#roomModel.create(room)
  }

  /**
   * Gets a specific room by id
   * @param {RoomId} id The id of the room
   * @return {Promise<Room>} The room
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryGetById (id) {
    return this.#roomModel.findById(id).exec()
      .catch(_ => { throw new RoomNotFoundError(id) })
  }

  /**
   * Updates a room in the database
   * @param {RoomId} id The id of the room
   * @param {Object} update The updated room data
   * @return {Promise}
   * @throws {RoomNotFoundError} When not room with the given id was found
   */
  async tryUpdateById (id, update) {
    await this.#roomModel.findByIdAndUpdate(id, update)
      .catch(_ => { throw new RoomNotFoundError(id) })
  }

  /**
   * Gets the name of the selected game in a room
   * @param {RoomId} roomId The id of the room
   * @return {Promise<GameName>} The name of the game
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
   * @param {RoomId} roomId The id of the room
   * @return {Promise<PlayerId[]>} The ids
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
