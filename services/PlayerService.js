module.exports = (repo) => {
  return {
    async createNew (id, name) {
      const player = await repo.putNew({
        _id: id,
        name: name,
        roomId: undefined
      })
      return player._id
    },
    async getPlayerById (id) {
      return repo.getById(id)
    },
    async joinRoom (id, roomId) {
      return repo.updateById(id, { roomId })
    },
    async remove (id) {
      return repo.deleteById(id)
    }
  }
}
