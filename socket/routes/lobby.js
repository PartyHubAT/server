const SocketRoute = require('../socketRoute.js')
const Cmd = require('../cmd.js')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isInLobby = (hub, playerId) =>
  hub.getPlayerById(playerId).inInRoom

/**
 * Event handler for when a player joined a lobby
 * @type {SocketEventHandler}
 */
const onLobbyJoined = (hub, playerId) => {
  const player = hub.getPlayerById(playerId)
  const playerNames = hub.getPlayerNamesInRoom(player.roomId)
  const role = hub.getPlayersRole(playerId)
  const gameName = hub.getGameInRoom(player.roomId)

  return [
    hub,
    [
      Cmd.joinRoom(playerId, player.roomId),
      Cmd.emitToRoom(player.roomId, 'playersChanged', { playerNames }),
      Cmd.emitToOne(playerId, 'roleChanged', { role }),
      Cmd.emitToOne(playerId, 'gameSelected', { gameName })
    ]
  ]
}

/**
 * Event handler for when the host changes the game
 * @type {SocketEventHandler}
 */
const selectGame = (hub, playerId, data) => {
  const player = hub.getPlayerById(playerId)
  console.log(`The host of room ${player.roomId} changed the game to "${data.gameName}".`)

  return [
    hub
      .changeGameInRoom(player.roomId, data.gameName),
    [
      Cmd.emitToRoom(player.roomId, 'gameSelected', { gameName: data.gameName })
    ]
  ]
}

/**
 * Event handler for when the host starts the game
 * @type {SocketEventHandler}
 */
const startGame = (hub, playerId) => {
  const player = hub.getPlayerById(playerId)
  const gameName = hub.getGameInRoom(player.roomId)

  console.log(`Room ${player.roomId}' started playing "${gameName}".`)

  return [
    hub,
    [
      Cmd.emitToRoom(player.roomId, 'gameStarted', { gameName })
    ]
  ]
}

/**
 * Event handler for when a player disconnects from the lobby
 * @type {SocketEventHandler}
 */
const disconnect = (hub, playerId) => {
  const player = hub.getPlayerById(playerId)
  const newHub = hub.removePlayer(playerId)
  const playerNames = newHub.getPlayerNamesInRoom(player.roomId)

  console.log(`Player "${player.name}" (${playerId}) disconnected from lobby ${player.roomId}.`)

  return [
    newHub,
    [
      Cmd.emitToRoom(player.roomId, 'playersChanged', { playerNames })
    ]
  ]
}

module.exports = new SocketRoute(
  isInLobby,
  [
    onLobbyJoined,
    selectGame,
    startGame,
    disconnect
  ]
)
