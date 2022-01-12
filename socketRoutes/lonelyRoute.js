const SocketRoute = require('./socketRoute.js')
const Cmd = require('./cmd.js')
const Room = require('../models/room')

/**
 * Checks if this route should be taken
 * @type {RoutePredicate}
 */
const isLonelyPlayer = (hub, playerId) =>
  !hub.players.get(playerId).inInRoom

/**
 * Event handler for when a player creates a new room
 * @type {SocketEventHandler}
 */
const newRoom = (hub, playerId, data) => {
  const newRoom = Room.openNew().addPlayer(playerId)
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to create room ${newRoom.id}.`)
  const nextHub = hub
    .mapPlayers(it => it
      .setPlayerName(playerId, data.playerName)
      .setPlayerRoomId(playerId, newRoom.id))
    .mapRooms(it => it
      .add(newRoom))
  return [nextHub, [
    Cmd.toOne(playerId, 'joinSuccess', { roomId: newRoom.id })
  ]]
}

/**
 * Event handler for when a player joins a room
 * @type {SocketEventHandler}
 */
const joinRoom = (hub, playerId, data) => {
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to join room ${data.roomId}.`)
  const nextHub = hub
    .mapPlayers(it => it
      .setPlayerName(playerId, data.playerName)
      .setPlayerRoomId(playerId, data.roomId))
    .mapRoom(data.roomId, it => it
      .addPlayer(playerId))
  return [nextHub, [
    Cmd.toOne(playerId, 'joinSuccess', { roomId: data.roomId })
  ]]
}

/**
 * Event handler for when a player disconnects
 * @type {SocketEventHandler}
 */
const disconnect = (hub, playerId) => {
  console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
  return [hub.mapPlayers(it => it.remove(playerId)), []]
}

module.exports = new SocketRoute(
  isLonelyPlayer,
  [
    disconnect,
    newRoom,
    joinRoom
  ]
)
