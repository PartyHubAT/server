/**
 * Service for interacting with games
 * @param repo Player-repo, for storing and retrieving players
 * @returns {{getGameNames(): Promise<string[]>, getGameInfo(): Promise<Object[]>, addGame(Object): Promise<void>, getServerLogicFor(string, string): (Object|undefined)}|*[]|undefined|*}
 */
module.exports = (repo) => {
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
      const games = await repo.getAll()
      return games.map(it => ({ name: it.name }))
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
     * @returns {Object|undefined} The game-logic or undefined if the game is not found
     */
    getServerLogicFor (gamesPath, gameName) {
      try {
        return require(`${gamesPath}/${gameName}/server.js`)
      } catch (e) {
        return undefined
      }
    }
  }
}
