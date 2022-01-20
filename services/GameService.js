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
   * @returns {Promise<any>} The resource or undefined if not found
   */
  static async #tryGetGameResource (gamesPath, gameName, resourceName) {
    try {
      return require(`${gamesPath}/${gameName}/${resourceName}`)
    } catch (e) {
      throw Error()
    }
  }

  /**
   * Adds a new game
   * @param {NewGame} game The game to add
   * @returns {Promise<void>}
   */
  async addGame (game) {
    await this.#gameRepo.putNew(game)
  }

  /**
   * Gets all games
   * @returns {Promise<Game[]>} The games
   */
  async getAllGames () {
    return this.#gameRepo.getAll()
  }

  /**
   * Gets the names of all games on this server
   * @returns {Promise<GameName[]>} The names of the games
   */
  async getGameNames () {
    return this.#gameRepo.getNamesOfAll()
  }

  /**
   * Gets the server-logic for a specific game
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Promise<GameLogicInit>} The game initializer
   */
  async tryGetServerLogicFor (gamesPath, gameName) {
    return GameService.#tryGetGameResource(gamesPath, gameName, 'server.js')
  }

  /**
   * Gets the default settings for a game
   * @param {string} gamesPath The path where all games are stored
   * @param {GameName} gameName The name of the game
   * @returns {Promise<Object>} The default settings
   */
  async tryGetDefaultGameSettings (gamesPath, gameName) {
    const settings = await GameService.#tryGetGameResource(gamesPath, gameName, 'settings.js')
    return settings.defaultValues
  }
}

module.exports = GameService
