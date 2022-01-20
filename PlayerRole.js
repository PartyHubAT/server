/**
 * The different roles a player can have
 * @enum {string}
 * @readonly
 */
const PlayerRole = {
  /**
   * The player is the host of a room
   */
  HOST: 'HOST',
  /**
   * The player is a guest in a room
   */
  GUEST: 'GUEST'
}

module.exports = PlayerRole
