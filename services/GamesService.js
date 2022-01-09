/**
 * Service for interacting with games
 * @param repo Player-repo, for storing and retrieving players
 * @returns {{getGameNames(): Promise<string[]>, getGameInfo(): Promise<Object[]>, addGame(Object): Promise<void>, getServerLogicFor(string, string): (Function|undefined), getDefaultGameSettings(string, string): (Object|undefined)}}
 */
module.exports = (repo) => {
  /**
   * Gets a specific game resource
   * @param {string} gamesPath The path where all games are stored
   * @param {string} gameName The name of the game
   * @param {string} resourceName The file-name of the resource
   * @returns {Promise<Object|undefined>} The resource or undefined if not found
   */
  async function getGameResource (gamesPath, gameName, resourceName) {
    try {
      return require(`${gamesPath}/${gameName}/${resourceName}`)
    } catch (e) {
      return undefined
    }
  }

  return {
    /**
     * Adds a new game
     * @param {Object} game The game
     * @returns {Promise<void>}
     */
    async addGame (game) {
      await repo.putNew(game)
    },

    /**
     * Gets info on all games on this server
     * @returns {Promise<Object[]>} The games
     */
    async getGameInfo () {
      return repo.getAll()
    },

    /**
     * Gets the names of all games on this server
     * @returns {Promise<string[]>} The names of the games
     */
    async getGameNames () {
      const games = await this.getGameInfo()
      return games.map(it => it.name)
    },

    /**
     * Gets the server-logic for a specific game
     * @param {string} gamesPath The path where all games are stored
     * @param {string} gameName The name of the game
     * @returns {Function|undefined} A function to initialize the game-server or undefined if the game is not found
     */
    async getServerLogicFor (gamesPath, gameName) {
      return getGameResource(gamesPath, gameName, 'server.js')
    },

    /**
     * Gets the default settings for a game
     * @param {string} gamesPath The path where all games are stored
     * @param {string} gameName The name of the game
     * @returns {Object|undefined} The default settings or undefined if the game was not found
     */
    async getDefaultGameSettings (gamesPath, gameName) {
      const settings = await getGameResource(gamesPath, gameName, 'settings.js')
      return settings.defaultValues
    }
  }
}
