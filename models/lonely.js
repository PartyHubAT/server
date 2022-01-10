module.exports = class Lonely {
  /**
   * The lonelies' socket.io connection
   */
  #socket

  constructor (socket) {
    this.#socket = socket
  }

  /**
   * Gets this lonelies id
   * @return {string} The id
   */
  get id () {
    return this.#socket.id
  }

  /**
   * Add a callback for when the lonely disconnects
   * @param {function} cb The callback
   */
  onDisconnect (cb) {
    this.#socket.on('disconnect', () => cb())
  }

  /**
   * Disposes this lonely
   */
  dispose () {
    this.#socket.removeAllListeners()
  }
}
