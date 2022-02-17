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
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @param {string} resourceName The file-name of the resource
   * @returns {Promise<any>} The resource
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
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Promise<GameLogicInit>} The game initializer
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async tryGetServerLogicFor (gamesPath, gameName) {
    return GameService.#tryGetGameResource(gamesPath, gameName, 'server.js')
  }

  /**
   * Gets the default settings for a game
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Promise<Object>} The default settings
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async tryGetDefaultGameSettings (gamesPath, gameName) {
    const settings = await GameService.#tryGetGameResource(gamesPath, gameName, 'settings.js')
    return settings.defaultValues
  }

  /**
   * Gets the default settings for a game
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Promise<Object>} The default settings
   * @throws {GameResourceLoadError} When the resource could not be loaded
   */
  static async tryGetGameSettings (gamesPath, gameName) {
    const settings = await GameService.#tryGetGameResource(gamesPath, gameName, 'settings.js')
    return settings
  }

  /**
   * Loads all games from their directories
   * @param {import('fs')} fs
   * @param {string} gamesPath
   * @returns {Promise}
   */
  loadGamesFromDir (fs, gamesPath) {
    this.#gameRepo.loadGamesFromDir(fs, gamesPath)
  }

  /**
   * Gets all games
   * @returns {Game[]} The games
   */
  getAllGames () {
    return this.#gameRepo.getAll()
  }

  /**
   * Gets certain game settings
   * @returns {Promise<Settings[]>} The settings object
   */
  async getSettings (gamesPath, game) {
    return await GameService.tryGetGameSettings(gamesPath, game)
  }

  /**
   * Gets the names of all games on this server
   * @returns {GameName[]} The names of the games
   */
  getGameNames () {
    return this.#gameRepo.getNamesOfAll()
  }
}

module.exports = GameService
