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
