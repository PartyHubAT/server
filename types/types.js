/**
 * @typedef {Object} GameEvents
 */

/**
 * @typedef {Object} GameServer
 * @property {GameEvents} events
 */

/**
 * Emits a message to all players in the room
 * @callback EmitToAll
 * @param {string} event The name of the event to emit
 * @param {Object} data The data to event
 */

/**
 * Emits a message to a specific player
 * @callback EmitToOne
 * @param {PlayerId} playerId The id of the player to emit to
 * @param {string} event The name of the event to emit
 * @param {Object} data The data to event
 */

/**
 * @callback EndGame
 */

/**
 * @typedef {Object} Settings
 */

/**
 * Initializes a new game-server
 * @callback GameLogicInit
 * @param {EmitToAll} emitToAll
 * @param {EmitToOne} emitToOne
 * @param {EndGame} endGame
 * @param {Player[]} players
 * @param {Settings} settings
 * @param {import('mongoose')} mongoose
 * @return {GameServer} The created game-server
 */
