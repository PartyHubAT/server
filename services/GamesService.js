module.exports = (repo) => {
  return {
    async addGame (game) {
      await repo.putNew(game)
    },
    async getGameInfo () {
      const games = await repo.getAll()
      return games.map(it => ({ name: it.name }))
    },
    async getGameNames () {
      const games = await this.getGameInfo()
      return games.map(it => it.name)
    },
    getServerLogicFor (gamesPath, gameName) {
      try {
        return require(`${gamesPath}/${gameName}/server.js`)
      } catch (e) {
        return undefined
      }
    }
  }
}
