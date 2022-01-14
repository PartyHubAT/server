const SocketRoute = require('../socketRoute')
const RoomPhase = require('../../models/roomPhase')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isInGameSetup = (hub, playerId) => {
  const player = hub.getPlayerById(playerId)
  return player.inInRoom && hub.getRoomPhase(player.roomId) === RoomPhase.GAMESETUP
}

/**
 * Event handler for when a player joined a lobby
 * @type {SocketEventHandler}
 */
const onGameSetup = (hub, playerId) => {
  return [
    hub.setPlayerHasGameSetup(playerId, true),
    []
  ]
}

module.exports = new SocketRoute(
  isInGameSetup,
  [onGameSetup]
)
