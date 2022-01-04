module.exports = (mongoose, fs) => {
  const Game = require('../models/Game.js')(mongoose)

  return {
    async loadFrom (path) {
      return Promise.all(
        (await fs.promises.readdir(path, { withFileTypes: true }))
          .filter(it => it.isDirectory())
          .map(it => require(`${path}/${it.name}/info.js`))
          .map(async game => Game.create(game)))
    },
    async getGames () {
      return Game.find()
    },
    async getGameNames () {
      return (await this.getGames()).map(it => it.name)
    }
  }
}
