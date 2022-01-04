const mathUtil = require('../core/mathUtil')

module.exports = (repo, playerService) => {
  function generateRoomId () {
    return mathUtil.randBetween(10000, 999999)
  }

  return {
    async openNewWithHost (host) {
      return (await repo.putNew({
        _id: generateRoomId(),
        gameName: '',
        hostId: host._id,
        playerIds: [host._id]
      }))._id
    },
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },
    async getRoom (roomId) {
      return repo.getById(roomId)
    },
    async getPlayersInRoom (roomId) {
      const playerIds = (await this.getRoom(roomId)).playerIds
      return Promise.all(playerIds.map(id => playerService.getPlayerById(id)))
    },
    async getPlayerNamesInRoom (roomId) {
      return (await this.getPlayersInRoom(roomId)).map(it => it.name)
    }
  }
}
