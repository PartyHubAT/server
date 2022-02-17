/**
 * Loads all games from the filesystem into the database
 * @param {GameService} gameService Games-service for storing the games
 * @param {module:fs} fs File-system
 * @param {string} gamesPath The path to the games
 * @returns {Promise}
 */
async function loadGames (gameService, fs, gamesPath) {
  console.log('Load games...')

  await gameService.loadGamesFromDir(fs, gamesPath)

  console.log(`Games loaded (${(gameService.getGameNames()).join(', ')})`)
}

module.exports = loadGames
