const mathUtil = require('../core/mathUtil')

module.exports = (repo) => {
  function generateRoomId () {
    return mathUtil.randBetween(10000, 999999)
  }

  function makeHost (name) { return { name, role: 'HOST' } }

  return {
    async openNew (hostPlayerName) {
      return (await repo.putNew({
        _id: generateRoomId(),
        gameName: '',
        players: [
          makeHost(hostPlayerName)
        ]
      }))._id
    },
    getSocketRoomName (roomId) {
      return `Room-${roomId}`
    },
    async getRoom (roomId) {
      return repo.getById(roomId)
    },
    async getPlayersInRoom (roomId) {
      return (await this.getRoom(roomId)).players
    },
    async getPlayerByName (roomId, name) {
      return (await this.getPlayersInRoom(roomId)).filter(it => it.name === name)
    },
    async getPlayerRole (roomId, playerName) {
      return (await this.getPlayerByName(roomId, playerName)).role
    },
    async getPlayerNamesInRoom (roomId) {
      return (await this.getPlayersInRoom(roomId)).map(it => it.name)
    }
  }
}
