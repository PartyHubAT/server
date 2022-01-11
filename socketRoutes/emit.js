const EMIT_TO_ONE = 0
const EMIT_TO_ROOM = 1
const JOIN_ROOM = 2
const LEAVE_ROOM = 3

/**
 * Makes socket.io send data to a specific player
 * @typedef {Object} EmitToOneEmit
 * @property {number} type The type of the emit (EMIT_TO_ROOM)
 * @property {string} playerId The id of the player to emit to
 * @property {string} eventName The name of the event
 * @property {any} data The data to send
 */

/**
 * Makes socket.io send data to all players in a room
 * @typedef {Object} EmitToRoomEmit
 * @property {number} type The type of the emit (EMIT_TO_ONE)
 * @property {number} roomId The id of the room to emit to
 * @property {string} eventName The name of the event
 * @property {any} data The data to send
 */

/**
 * Makes socket.io add a player to a socket-room
 * @typedef {Object} JoinRoomEmit
 * @property {number} type The type of the emit (JOIN_ROOM)
 * @property {string} playerId The id of the player that should join
 * @property {number} roomId The id of the room to join
 */

/**
 * Makes socket.io remove a player from a socket-room
 * @typedef {Object} LeaveRoomEmit
 * @property {number} type The type of the emit (LEAVE_ROOM)
 * @property {string} playerId The id of the player that should leave
 * @property {number} roomId The id of the room to leave
 */

/**
 * An action that is executed by socket.io in response to an event
 * @typedef {EmitToOneEmit|EmitToRoomEmit|JoinRoomEmit|LeaveRoomEmit} SocketEmit
 */

/**
 * Makes an event for emitting data to a specific player
 * @param {string} playerId The id of the player
 * @param {string} eventName The name of the event
 * @param {any} data The data to send
 * @return {SocketEmit} The created event
 */
function toOne (playerId, eventName, data) {
  return { type: EMIT_TO_ONE, playerId, eventName, data }
}

/**
 * Makes an event for emitting data to all players in a room
 * @param {number} roomId The id of the room to emit to
 * @param {string} eventName The name of the event
 * @param {any} data The data to send
 * @return {SocketEmit} The created event
 */
function toRoom (roomId, eventName, data) {
  return { type: EMIT_TO_ROOM, roomId, eventName, data }
}

/**
 * Makes an event for adding a player to a socket-room
 * @param {string} playerId The id of the player
 * @param {number} roomId The id of the room
 * @return {SocketEmit} The created event
 */
function joinRoom (playerId, roomId) {
  return { type: JOIN_ROOM, playerId, roomId }
}

/**
 * Makes an event for removing a player from a socket-room
 * @param {string} playerId The id of the player
 * @param {number} roomId The id of the room
 * @return {SocketEmit} The created event
 */
function leaveRoom (playerId, roomId) {
  return { type: LEAVE_ROOM, playerId, roomId }
}

module.exports = {
  EMIT_TO_ONE,
  EMIT_TO_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  toOne,
  toRoom,
  joinRoom,
  leaveRoom
}
