module.exports = (repo) => {
  return {
    async addGame (game) {
      return repo.putNew(game)
    },
    async getGameInfo () {
      return (await repo.getAll()).map(it => ({ name: it.name }))
    },
    async getGameNames () {
      return (await this.getGameInfo()).map(it => it.name)
    }
  }
}
