module.exports = (mongoose) => {
  const Room = require('../models/Room.js')(mongoose)

  return {
    async putNew (room) {
      return Room.create(room)
    },
    async getById (id) {
      return Room.findById(id)
    },
    async updateById (id, update) {
      await Room.findByIdAndUpdate(id, update)
    }
  }
}
