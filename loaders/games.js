module.exports = async (gameService, fs, gamesPath) => {
  console.log('Load games...')

  await Promise.all(
    (await fs.promises.readdir(gamesPath, { withFileTypes: true }))
      .filter(it => it.isDirectory())
      .map(it => require(`${gamesPath}/${it.name}/info.js`))
      .map(async game => gameService.addGame(game)))

  console.log(`Games loaded (${(await gameService.getGameNames()).join(', ')})`)
}
