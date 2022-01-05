const mathUtil = require('../core/mathUtil')

module.exports = (repo, playerService) => {
  function generateRoomId () {
    return mathUtil.randBetween(10000, 999999)
  }

  return {
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },
    async getRoom (roomId) {
      return repo.getById(roomId)
    },
    async getPlayerIdsInRoom (roomId) {
      return (await this.getRoom(roomId)).playerIds
    },
    async getPlayersInRoom (roomId) {
      const playerIds = await this.getPlayerIdsInRoom(roomId)
      return Promise.all(playerIds.map(id => playerService.getPlayerById(id)))
    },
    async getPlayerNamesInRoom (roomId) {
      return (await this.getPlayersInRoom(roomId)).map(it => it.name)
    },
    async getPlayerInRoomById (roomId, playerId) {
      return (await this.getPlayersInRoom(roomId)).find(it => it._id === playerId)
    },
    async getHostId (roomId) {
      // The first player in the room is host
      return (await this.getPlayerIdsInRoom(roomId))[0]
    },
    async getPlayerRole (roomId, playerId) {
      return (await this.getHostId(roomId)) === playerId ? 'HOST' : 'GUEST'
    },
    async getSelectedGameName (roomId) {
      return (await this.getRoom(roomId)).gameName
    },
    async addPlayer (roomId, playerId) {
      const ids = await this.getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.concat(playerId) })
      await playerService.joinRoom(playerId, roomId)
    },
    async openNewWithHost (hostId) {
      const roomId = (await repo.putNew({
        _id: generateRoomId(),
        gameName: '',
        playerIds: []
      }))._id
      await this.addPlayer(roomId, hostId)
      return roomId
    },
    async removePlayer (roomId, playerId) {
      const ids = await this.getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
    },
    async selectGame (roomId, gameName) {
      await repo.updateById(roomId, { gameName })
    }
  }
}
