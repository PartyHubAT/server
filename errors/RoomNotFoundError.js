/**
 * Error for when a room was not found in the database
 */
class RoomNotFoundError extends Error {
  /**
   * The id of the missing room
   * @type {RoomId}
   */
  roomId

  /**
   * Initialized a new error
   * @param {RoomId} roomId The id of the missing room
   */
  constructor (roomId) {
    super(`No room with the id ${roomId} was found.`)
    this.roomId = roomId
  }
}

module.exports = RoomNotFoundError
