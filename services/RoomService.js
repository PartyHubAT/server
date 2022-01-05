const mathUtil = require('../core/mathUtil')

module.exports = (repo, playerService) => {
  function generateRoomId () {
    return mathUtil.randBetween(10000, 999999)
  }

  async function getRoom (roomId) {
    return repo.getById(roomId)
  }

  async function getPlayerIdsInRoom (roomId) {
    const room = await getRoom(roomId)
    return room ? room.playerIds : []
  }

  async function getPlayersInRoom (roomId) {
    const playerIds = await getPlayerIdsInRoom(roomId)
    return Promise.all(playerIds.map(id => playerService.getPlayerById(id)))
  }

  async function getHostId (roomId) {
    const ids = await getPlayerIdsInRoom(roomId)
    return ids.length > 0
      ? ids[0] // The first player in the room is the host
      : undefined
  }

  return {
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },
    async getPlayerRole (roomId, playerId) {
      const hostId = await getHostId(roomId)
      return hostId ? (hostId === playerId ? 'HOST' : 'GUEST') : undefined
    },
    async getSelectedGameName (roomId) {
      const room = await getRoom(roomId)
      return room ? room.gameName : undefined
    },
    async addPlayerToRoom (roomId, playerId) {
      const ids = await getPlayerIdsInRoom(roomId)
      await repo.updateById(roomId, { playerIds: ids.concat(playerId) })
      await playerService.joinRoom(playerId, roomId)
    },
    async getPlayerNamesInRoom (roomId) {
      const players = await getPlayersInRoom(roomId)
      return players.map(it => it.name)
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
