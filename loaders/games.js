/**
 * Loads all games from the filesystem into the database
 * @param {Object} gameService Games-service for storing the games
 * @param {Object} fs File-system
 * @param {Object} gamesPath The path to the games
 * @returns {Promise<void>}
 */
module.exports = async (gameService, fs, gamesPath) => {
  console.log('Load games...')

  const filesInGamesDir = await fs.promises.readdir(gamesPath, { withFileTypes: true })
  const games =
    filesInGamesDir
      .filter(it => it.isDirectory())
      .map(it => require(`${gamesPath}/${it.name}/info.js`))

  await Promise.all(games.map(async game => gameService.addGame(game)))

  console.log(`Games loaded (${(await gameService.getGameNames()).join(', ')})`)
}
