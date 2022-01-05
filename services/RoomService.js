const mathUtil = require('../core/mathUtil')

module.exports = (repo, playerService) => {
  function generateRoomId () {
    return mathUtil.randBetween(10000, 999999)
  }

  async function getRoom (roomId) {
    return repo.getById(roomId)
  }

  async function getPlayerIdsInRoom (roomId) {
    return (await getRoom(roomId)).playerIds
  }

  async function getPlayersInRoom (roomId) {
    const playerIds = await getPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => playerService.getPlayerById(id)))
  }

  async function getHostId (roomId) {
    // The first player in the room is host
    return (await getPlayerIdsInRoom(roomId))[0]
  }

  return {
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },
    async getPlayerRole (roomId, playerId) {
      return (await getHostId(roomId)) === playerId ? 'HOST' : 'GUEST'
    },
    async getSelectedGameName (roomId) {
      return (await getRoom(roomId)).gameName
    },
    async addPlayerToRoom (roomId, playerId) {
      const ids = await getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.concat(playerId) })
      await playerService.joinRoom(playerId, roomId)
    },
    async getPlayerNamesInRoom (roomId) {
      return (await getPlayersInRoom(roomId)).map(it => it.name)
    },
    async openNewWithHost (hostId) {
      const roomId = (await repo.putNew({
        _id: generateRoomId(),
        gameName: '',
        playerIds: []
      }))._id
      await this.addPlayerToRoom(roomId, hostId)
      return roomId
    },
    async removePlayerFromRoom (roomId, playerId) {
      const ids = await getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.filter(it => it !== playerId) })
    },
    async selectGame (roomId, gameName) {
      await repo.updateById(roomId, { gameName })
    }
  }
}
