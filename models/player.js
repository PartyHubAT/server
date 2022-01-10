module.exports = class Player {
  /**
   * The players id
   * @type {string}
   */
  #id
  /**
   * The players name
   * @type {string}
   */
  #name

  constructor (id, name) {
    this.#id = id
    this.#name = name
  }

  /**
   * Creates a new unknown-player
   * @param {string} id The players id
   * @return {Player}
   */
  static makeUnknown (id) {
    return new Player(id, 'unknown')
  }

  /**
   * The players id
   * @return {string}
   */
  get id () {
    return this.#id
  }

  /**
   * The players name
   * @return {string}
   */
  get name () {
    return this.#name
  }

  /**
   * Creates a new player with the same id but different name
   * @param {string} name The new name
   * @return {Player} The new player
   */
  withName (name) {
    return new Player(this.#id, name)
  }
}
