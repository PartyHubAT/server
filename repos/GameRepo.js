/**
 * @typedef {string} GameName
 */

/**
 * @typedef {Object} Game
 * @property {GameName} name
 * @property {string} displayName
 * @property {string} description
 * @property {number} minPlayerCount
 * @property {number} maxPlayerCount
 *
 */

/**
 * Stores and retrieves games
 */

class GameRepo {
  /**
   * Array of all games in repo
   * @type {Game[]}
   */
  #games = []

  /**
   * Loads all games from their directories
   * @param {import('fs')} fs
   * @param {string} gamesPath
   * @returns {Promise}
   */
   loadGamesFromDir = async (fs, gamesPath) => {
     const filesInGamesDir = await fs.promises.readdir(gamesPath, { withFileTypes: true })

     this.#games =
       filesInGamesDir
         .filter(it => it.isDirectory())
         .map(it => require(`${gamesPath}/${it.name}/info.js`))
   }

   /**
   * Returns all games
   * @return {Game[]}
   */
   getAll () {
     return JSON.parse(JSON.stringify(this.#games))
   }

   /**
   * Gets the names of all games
   * @return {GameName[]}
   */
   getNamesOfAll () {
     return this.#games.map(game => {
       return game.name
     })
   }
}

module.exports = GameRepo
