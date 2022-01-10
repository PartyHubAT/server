const LonelyZone = require('./lonelyZone.js')

module.exports = class Hub {
  /**
   * The lonely-zone
   * @type {LonelyZone}
   */
  #lonelyZone

  constructor (lonelyZone) {
    this.#lonelyZone = lonelyZone
  }

  /**
   * An empty hub
   * @type {Hub}
   */
  static empty = new Hub(LonelyZone.empty)

  /**
   * Processes an event
   * @param {string} playerId The id of the player who triggered the event
   * @param {string} eventName The name of the event
   * @param {any} data The data that was sent with the event
   * @return {{emits: *[], newHub: Hub}} A new hub, with any changes the event cause, as well as an array of emits
   */
  processSocketEvent (playerId, eventName, data) {
    const output = (hub, emits) => ({ newHub: hub, emits })

    const noChanges = () => output(new Hub(this.#lonelyZone), [])

    if (this.#lonelyZone.has(playerId)) { // The player who sent the message is in the lonely-zone
      switch (eventName) {
        case 'disconnect':
          console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
          return { newHub: new Hub(this.#lonelyZone.remove(playerId)), emits: [] }
        default:
          return noChanges()
      }
    } else { // The player who sent the message is completely unknown
      // The only thing unknown players can do is connect
      if (eventName === 'connect') {
        console.log(`New player (${playerId}) entered the lonely-zone.`)
        return { newHub: new Hub(this.#lonelyZone.addNew(playerId)), emits: [] }
      } else { return noChanges() }
    }
  }
}
