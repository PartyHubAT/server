module.exports = (mongoose) => {
  const Player = require('../models/Player.js')(mongoose)

  return {
    async putNew (player) {
      return Player.create(player)
    },
    async getById (id) {
      return Player.findById(id)
    },
    async deleteById (id) {
      return Player.findByIdAndDelete(id)
    }
  }
}
