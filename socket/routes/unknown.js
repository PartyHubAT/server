const SocketRoute = require('../socketRoute.js')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isUnknownPlayer = (hub, playerId) =>
  !hub.hasPlayerWithId(playerId)

/**
 * Event handler for when a player connects
 * @type {SocketEventHandler}
 */
const connect = (hub, playerId) => {
  console.log(`New player (${playerId}) entered the lonely-zone.`)
  return [
    hub
      .addLonely(playerId),
    []
  ]
}

module.exports = new SocketRoute(
  isUnknownPlayer,
  [
    connect
  ]
)
