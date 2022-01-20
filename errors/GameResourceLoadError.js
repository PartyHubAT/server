/**
 * Error for when a game-resource could not be loaded
 */
class GameResourceLoadError extends Error {
  /**
   * The path of the resource
   * @type {string}
   */
  path
  /**
   * The cause of the load-issue
   * @type {Error}
   */
  cause

  /**
   * Initialized a new error
   * @param {string} path The path of the resource
   * @param {Error} cause The cause of the load-issue
   */
  constructor (path, cause) {
    super(`The resource at path "${path}" could not be loaded`)
    this.path = path
    this.cause = cause
  }
}

module.exports = GameResourceLoadError
