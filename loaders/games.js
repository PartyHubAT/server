/**
 * Loads all games from the filesystem into the database
 * @param {GameService} gameService Games-service for storing the games
 * @param {module:fs} fs File-system
 * @param {string} gamesPath The path to the games
 * @returns {Promise}
 */
async function loadGames (gameService, fs, gamesPath) {
  console.log('Load games...')

  try {
    const filesInGamesDir = await fs.promises.readdir(gamesPath, { withFileTypes: true })
    const games =
      filesInGamesDir
        .filter(it => it.isDirectory())
        .map(it => require(`${gamesPath}/${it.name}/info.js`))

    await Promise.all(games.map(async game => gameService.addGame(game)))

    console.log(`Games loaded (${(await gameService.getGameNames()).join(', ')})`)
  } catch (e) {
    console.warn(`No games found on path '${gamesPath}'`)
  }
}

module.exports = loadGames
