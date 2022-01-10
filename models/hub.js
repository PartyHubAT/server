const LonelyZone = require('./lonelyZone.js')
const Lonely = require('./lonely.js')

module.exports = class Hub {
  #lonelyZone = LonelyZone.empty()

  /**
   * Adds a new lonely to the hub
   * @param {*} socket
   */
  addLonelyFromSocket (socket) {
    const lonely = new Lonely(socket)
    this.#lonelyZone.add(lonely)
  }
}
