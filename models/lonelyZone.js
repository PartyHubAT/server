module.exports = class LonelyZone {
  /**
   * Creates a new empty lonely-zone
   * @return {LonelyZone} The created lonely-zone
   */
  static empty () {
    return new LonelyZone(new Map())
  }

    /**
     * The lonelies in this zone
     */
    #lonelies

    constructor (lonelies) {
      this.#lonelies = lonelies
    }

    add (lonely) {
      console.log(`A new player (${lonely.id}) entered the lonely-zone.`)
      this.#lonelies.set(lonely.id, lonely)
      lonely.onDisconnect(() => this.#disconnect(lonely))
    }

    #disconnect (lonely) {
      console.log(`A lonely player (${lonely.id}) disconnected.`)
      this.#remove(lonely)
    }

    #remove (lonely) {
      this.#lonelies.delete(lonely.id)
      lonely.dispose()
    }
}
