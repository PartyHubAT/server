module.exports = (repo, fs) => {
  return {
    async loadFrom (path) {
      return Promise.all(
        (await fs.promises.readdir(path, { withFileTypes: true }))
          .filter(it => it.isDirectory())
          .map(it => require(`${path}/${it.name}/info.js`))
          .map(async game => repo.putNew(game)))
    },
    async getGameNames () {
      return (await repo.getAll()).map(it => it.name)
    }
  }
}
