const GameResourceLoadError = require('../errors/GameResourceLoadError')

/**
 * Allows interaction with games
 */
class GameService {
  /**
   * The repo used to store and retrieve games
   * @type {GameRepo}
   */
  #gameRepo

  /**
   * Initializes a new game-service
   * @param {GameRepo} gameRepo The repo used to store and retrieve games
   */
  constructor (gameRepo) {
    this.#gameRepo = gameRepo
  }

  /**
   * Gets a specific game resource
   * @async
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @param {string} resourceName The file-name of the resource
   * @returns {any} The resource
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async #tryGetGameResource (gamesPath, gameName, resourceName) {
    const path = `${gamesPath}/${gameName}/${resourceName}`
    try {
      return require(path)
    } catch (e) {
      throw new GameResourceLoadError(path, e)
    }
  }

  /**
   * Gets the server-logic for a specific game
   * @async
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {GameLogicInit} The game initializer
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async tryGetServerLogicFor (gamesPath, gameName) {
    return GameService.#tryGetGameResource(gamesPath, gameName, 'server.js')
  }

  /**
   * Gets the default settings for a game
   * @async
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Object} The default settings
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async tryGetDefaultGameSettings (gamesPath, gameName) {
    const settings = await GameService.#tryGetGameResource(gamesPath, gameName, 'settings.js')
    return settings.defaultValues
  }

  /**
   * Adds a new game
   * @async
   * @param {NewGame} game The game to add
   */
  async addGame (game) {
    await this.#gameRepo.putNew(game)
  }

  /**
   * Gets all games
   * @async
   * @returns {Game[]} The games
   */
  async getAllGames () {
    return this.#gameRepo.getAll()
  }

  /**
   * Gets the names of all games on this server
   * @async
   * @returns {GameName[]} The names of the games
   */
  async getGameNames () {
    return this.#gameRepo.getNamesOfAll()
  }
}

module.exports = GameService
