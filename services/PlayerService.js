module.exports = (repo) => {
  return {
    async createNew (id, name) {
      return repo.putNew({
        _id: id,
        name: name
      })
    },
    async getPlayerById (id) {
      return repo.getById(id)
    }
  }
}
