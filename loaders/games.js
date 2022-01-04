module.exports = async (gameService, gamesPath) => {
  console.log('Load games...')
  await gameService.loadFrom(gamesPath)
  console.log(`Games loaded (${(await gameService.getGameNames()).join(', ')})`)
}
