const LonelyZone = require('./lonelyZone.js')
const Lobby = require('./lobby.js')
const { Map } = require('immutable')

module.exports = class Hub {
  /**
   * The lonely-zone
   * @type {LonelyZone}
   */
  #lonelyZone
  /**
   * The current lobbies
   */
  #lobbies

  constructor (lonelyZone, lobbies) {
    this.#lonelyZone = lonelyZone
    this.#lobbies = lobbies
  }

  /**
   * An empty hub
   * @type {Hub}
   */
  static empty = new Hub(LonelyZone.empty, Map())

  /**
   * Creates a new hub with a different lonely-zone
   * @param {LonelyZone} lonelyZone The new lonely-zone
   * @return {Hub} The new hub
   */
  #withLonelyZone (lonelyZone) {
    return new Hub(lonelyZone, this.#lobbies)
  }

  /**
   * Creates a new hub with  different lobbies
   * @param lobbies The new lobbies
   * @return {Hub} The new hub
   */
  #withLobbies (lobbies) {
    return new Hub(this.#lonelyZone, lobbies)
  }

  /**
   * Processes an event
   * @param {string} playerId The id of the player who triggered the event
   * @param {string} eventName The name of the event
   * @param {any} data The data that was sent with the event
   * @return {{emits: *[], newHub: Hub}} A new hub, with any changes the event cause, as well as an array of emits
   */
  processSocketEvent (playerId, eventName, data) {
    const output = (hub, emits) => ({ newHub: hub, emits })

    const noChanges = () => output(new Hub(this.#lonelyZone, this.#lobbies), [])

    if (this.#lonelyZone.has(playerId)) { // The player who sent the message is in the lonely-zone
      switch (eventName) {
        case 'newRoom': {
          const host = this.#lonelyZone.get(playerId).withName(data.playerName)
          const lobby = Lobby.openNew().addPlayer(host)
          return {
            newHub:
              this
                .#withLonelyZone(this.#lonelyZone.remove(playerId))
                .#withLobbies(this.#lobbies.set(lobby.roomId, lobby)),
            emits: []
          }
        }
        case 'disconnect':
          console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
          return {
            newHub:
              this.#withLonelyZone(this.#lonelyZone.remove(playerId)),
            emits: []
          }
        default:
          return noChanges()
      }
    } else { // The player who sent the message is completely unknown
      // The only thing unknown players can do is connect
      if (eventName === 'connect') {
        console.log(`New player (${playerId}) entered the lonely-zone.`)
        return {
          newHub:
            this.#withLonelyZone(this.#lonelyZone.addNew(playerId)),
          emits: []
        }
      } else { return noChanges() }
    }
  }
}
