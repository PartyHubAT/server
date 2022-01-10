
module.exports = class Game {
  #info
  #settings
  #serverLogic

  /**
   * Makes a new game
   * @param {Object} info An object containing info about the game
   * @param {Object} settings An object containing the games settings
   * @param {function} serverLogic A function for initializing the games server-logic
   */
  constructor (info, settings, serverLogic) {
    this.#info = info
    this.#settings = settings
    this.#serverLogic = serverLogic
  }

  /**
   * The games info
   * @return {Object|undefined}
   */
  get info () { return this.#info }

  /**
   * The games settings
   * @return {Object|undefined}
   */
  get settings () { return this.#settings }

  /**
   * The games default settings
   * @return {Object|undefined}
   */
  get defaultSettings () {
    const settings = this.settings
    return settings ? settings.defaultValues : undefined
  }

  /**
   * The games server-logic
   * @return {function|undefined}
   */
  get serverLogic () {
    return this.#serverLogic
  }
}
