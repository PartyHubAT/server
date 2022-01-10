const { Map } = require('immutable')

module.exports =
  /**
   * Stores multiple games
   */
  class Library {
  /**
   * An empty library
   */
  static empty= new Library(Map())

  #games

  constructor (games) {
    this.#games = games
  }

  /**
   * Add a game to a library
   * @param {Game} game The game
   * @return A new library, with the game added
   */
  add (game) {
    return new Library(this.#games.set(game.info.name, game))
  }

  /**
   * Gets info on all games in the library
   * @return {Object[]} Game info
   */
  get gameInfo () {
    return Array.from(this.#games.values()).map(game => game.info)
  }

  /**
   * Gets the names of all games in the library
   * @return {string[]} The names of the games in the library
   */
  get gameNames () {
    return Array.from(this.#games.keys())
  }

  /**
   * Gets a specific game by name
   * @param {String} gameName The name of the game
   * @return {Game|undefined} The game or undefined if not found
   */
  getGameByName (gameName) {
    return this.#games.get(gameName)
  }
  }
