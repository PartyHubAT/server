const SocketRoute = require('./socketRoute.js')
const Cmd = require('./cmd.js')
const Room = require('../models/room')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isLonelyPlayer = (hub, playerId) =>
  !hub.getPlayerById(playerId).inInRoom

/**
 * Event handler for when a player creates a new room
 * @type {SocketEventHandler}
 */
const newRoom = (hub, playerId, data) => {
  const newRoom = Room.openNew()
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to create room ${newRoom.id}.`)

  return [
    hub
      .addRoom(newRoom)
      .renamePlayer(playerId, data.playerName)
      .movePlayerToRoom(playerId, newRoom.id),
    [
      Cmd.emitToOne(playerId, 'joinSuccess', { roomId: newRoom.id })
    ]
  ]
}

/**
 * Event handler for when a player joins a room
 * @type {SocketEventHandler}
 */
const joinRoom = (hub, playerId, data) => {
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to join room ${data.roomId}.`)
  return [
    hub
      .renamePlayer(playerId, data.playerName)
      .movePlayerToRoom(playerId, data.roomId),
    [
      Cmd.emitToOne(playerId, 'joinSuccess', { roomId: data.roomId })
    ]
  ]
}

/**
 * Event handler for when a player disconnects
 * @type {SocketEventHandler}
 */
const disconnect = (hub, playerId) => {
  console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
  return [
    hub
      .removePlayer(playerId),
    []
  ]
}

module.exports = new SocketRoute(
  isLonelyPlayer,
  [
    disconnect,
    newRoom,
    joinRoom
  ]
)
