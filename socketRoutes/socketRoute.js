/**
 * Predicate for checking if a route should be used
 * @callback RoutePredicate
 * @param {Hub} hub The current state of the hub
 * @param {string} playerId The id of the player that triggered the event
 * @return {boolean} Whether the route should be used or not
 */

/**
 * Emits event after the mapping is complete
 * @callback Emitter
 * @param {SocketEmit} emit The emit
 */

/**
 * Maps the current hub to a new form
 * @callback SocketEventHandler
 * @param {Hub} hub The current state of the hub
 * @param {string} playerId The id of the player who triggered the event
 * @param {any} data The data that was sent with the event
 * @param {Emitter} emitter Helper to emit emits after the mapping is complete
 * @return {Hub} The new state of the hub
 */

/**
 * Generates emits based on the new state of the hub
 * @callback EmitGenerator
 * @param {Hub} hub The current state of the hub
 * @param {string} playerId The id of the player who triggered the event
 * @param {any} data The data that was sent with the event
 * @return {SocketEmit[]} The generated emit
 */

/**
 * Specifies a path that an event can go to in a route
 * @typedef {Object} EventPath
 * @property {string} eventName The name of the event that triggers this path
 * @property {SocketEventHandler} handler A handler for this event
 */

/**
 * A default event handler for when no event matches
 * @type {SocketEventHandler}
 */
const defaultUnknownPath = (hub) => hub

/**
 * Makes a new socket-route
 * @param {RoutePredicate} pred
 * @param {EventPath[]} eventPaths The paths the event can go down
 * @param {SocketEventHandler?} unknownPath The path if none of the others match
 * @constructor
 */
function SocketRoute (pred, eventPaths, unknownPath) {
  this.pred = pred
  this.eventPaths = eventPaths
  this.unknownPathHandler = unknownPath ?? defaultUnknownPath
}

module.exports = SocketRoute
