/**
 * Predicate for checking if a route should be used
 * @callback RoutePredicate
 * @param {Hub} hub The current state of the hub
 * @param {string} playerId The id of the player that triggered the event
 * @return {boolean} Whether the route should be used or not
 */

/**
 * Maps the current hub to a new form
 * @callback SocketEventHandler
 * @param {Hub} hub The current state of the hub
 * @param {string} playerId The id of the player who triggered the event
 * @param {any} data The data that was sent with the event
 * @return {[Hub,SocketCmd[]]} The new state of the hub and an array of cmds to execute
 */

/**
 * Specifies an event and the corresponding handler
 * @typedef {[string,SocketEventHandler]} EventPath
 */

/**
 * A default event handler for when no event matches
 * @type {SocketEventHandler}
 */
const defaultUnknownPath = (hub) => [hub, []]

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
