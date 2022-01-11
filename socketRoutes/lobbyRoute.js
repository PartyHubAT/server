const SocketRoute = require('./socketRoute.js')
const Emit = require('./emit.js')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isInLobby = (hub, playerId) =>
  hub.players.get(playerId).inInRoom

/**
 * Event handler for when a player joined a lobby
 * @type {SocketEventHandler}
 */
const onLobbyJoined = (hub, playerId, data, emitter) => {
  const player = hub.players.get(playerId)
  const playerNames = hub.getPlayersInRoom(player.roomId).map(it => it.name)

  emitter(Emit.joinRoom(playerId, player.roomId))
  emitter(Emit.toRoom(player.roomId, 'playersChanged', { playerNames }))

  return hub
}

/**
 * Event handler for when a player disconnects from the lobby
 * @type {SocketEventHandler}
 */
const onDisconnect = (hub, playerId, _, emitter) => {
  const player = hub.players.get(playerId)
  const newHub = hub
    .mapPlayers(it => it
      .remove(player))
    .mapRoom(player.roomId, it => it
      .removePlayer(playerId))
  const playerNames = newHub.getPlayersInRoom(player.roomId).map(it => it.name)

  console.log(`Player "${player.name}" (${playerId}) disconnected from lobby ${player.roomId}.`)
  emitter(Emit.toRoom(player.roomId, 'playersChanged', { playerNames }))

  return newHub
}

module.exports = new SocketRoute(
  isInLobby,
  [
    { eventName: 'onLobbyJoined', handler: onLobbyJoined },
    { eventName: 'disconnect', handler: onDisconnect }
  ]
)
