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
  const role = hub.getPlayerRoleInRoom(playerId, player.roomId)
  const gameName = hub.rooms.get(player.roomId).gameName

  emitter(Emit.joinRoom(playerId, player.roomId))
  emitter(Emit.toRoom(player.roomId, 'playersChanged', { playerNames }))
  emitter(Emit.toOne(playerId, 'roleChanged', { role }))
  emitter(Emit.toOne(playerId, 'gameSelected', { gameName }))

  return hub
}

/**
 * Event handler for when the host changes the game
 * @type {SocketEventHandler}
 */
const onSelectGame = (hub, playerId, data, emitter) => {
  const player = hub.players.get(playerId)
  console.log(`The host of room ${player.roomId} changed the game to "${data.gameName}".`)

  emitter(Emit.toRoom(player.roomId, 'gameSelected', { gameName: data.gameName }))

  return hub.mapRoom(player.roomId, room => room.withGameName(data.gameName))
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
    { eventName: 'selectGame', handler: onSelectGame },
    { eventName: 'disconnect', handler: onDisconnect }
  ]
)
