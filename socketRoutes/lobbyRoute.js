const SocketRoute = require('./socketRoute.js')
const Cmd = require('./cmd.js')

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

  emitter(Cmd.joinRoom(playerId, player.roomId))
  emitter(Cmd.toRoom(player.roomId, 'playersChanged', { playerNames }))
  emitter(Cmd.toOne(playerId, 'roleChanged', { role }))
  emitter(Cmd.toOne(playerId, 'gameSelected', { gameName }))

  return hub
}

/**
 * Event handler for when the host changes the game
 * @type {SocketEventHandler}
 */
const onSelectGame = (hub, playerId, data, emitter) => {
  const player = hub.players.get(playerId)
  console.log(`The host of room ${player.roomId} changed the game to "${data.gameName}".`)

  emitter(Cmd.toRoom(player.roomId, 'gameSelected', { gameName: data.gameName }))

  return hub.mapRoom(player.roomId, room => room.withGameName(data.gameName))
}

/**
 * Event handler for when the host starts the game
 * @type {SocketEventHandler}
 */
const onStartGame = (hub, playerId, _, emitter) => {
  const player = hub.players.get(playerId)
  const gameName = hub.rooms.get(player.roomId).gameName

  console.log(`Room ${player.roomId}' started playing "${gameName}".`)

  emitter(Cmd.toRoom(player.roomId, 'gameStarted', { gameName }))

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
  emitter(Cmd.toRoom(player.roomId, 'playersChanged', { playerNames }))

  return newHub
}

module.exports = new SocketRoute(
  isInLobby,
  [
    { eventName: 'onLobbyJoined', handler: onLobbyJoined },
    { eventName: 'selectGame', handler: onSelectGame },
    { eventName: 'startGame', handler: onStartGame },
    { eventName: 'disconnect', handler: onDisconnect }
  ]
)
