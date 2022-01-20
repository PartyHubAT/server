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
   * @param {string} gameName The name of the game
   * @param {string} resourceName The file-name of the resource
   * @returns {Promise<any|undefined>} The resource or undefined if not found
   */
  static async #getGameResource (gamesPath, gameName, resourceName) {
    try {
      return require(`${gamesPath}/${gameName}/${resourceName}`)
    } catch (e) {
      return undefined
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
   * @returns {Promise<string[]>} The names of the games
   */
  async getGameNames () {
    return this.#gameRepo.getNamesOfAll()
  }

  /**
   * Gets the server-logic for a specific game
   * @param {string} gamesPath The path where all games are stored
   * @param {string} gameName The name of the game
   * @returns {Function|undefined} A function to initialize the game-server or undefined if the game is not found
   */
  async getServerLogicFor (gamesPath, gameName) {
    return GameService.#getGameResource(gamesPath, gameName, 'server.js')
  }

  /**
   * Gets the default settings for a game
   * @param {string} gamesPath The path where all games are stored
   * @param {string} gameName The name of the game
   * @returns {Object|undefined} The default settings or undefined if the game was not found
   */
  async getDefaultGameSettings (gamesPath, gameName) {
    const settings = await GameService.#getGameResource(gamesPath, gameName, 'settings.js')
    return settings.defaultValues
  }
}

module.exports = GameService
