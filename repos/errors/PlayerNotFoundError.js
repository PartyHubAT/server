/**
 * Error for when a player was not found in the database
 */
class PlayerNotFoundError extends Error {
  /**
   * The id of the missing player
   * @type {PlayerId}
   */
  playerId

  /**
   * Initialized a new error
   * @param {PlayerId} playerId The id of the missing player
   */
  constructor (playerId) {
    super(`No player with the id "${playerId}" was found.`)
    this.playerId = playerId
  }
}

module.exports = PlayerNotFoundError
