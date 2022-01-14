/**
 * Enum for the different room-phases
 * @readonly
 * @enum {number}
 */
const RoomPhase = {
  /**
   * The room is waiting for players and selecting a game
   */
  LOBBY: 0,
  /**
   * The room is starting a game
   */
  GAMESETUP: 1,
  /**
   * The room is playing
   */
  INGAME: 2
}

module.exports = RoomPhase
