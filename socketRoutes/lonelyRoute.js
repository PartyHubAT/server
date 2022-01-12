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
const onNewRoom = (hub, playerId, data, emitter) => {
  const newRoom = Room.openNew().addPlayer(playerId)
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to create room ${newRoom.id}.`)
  const nextHub = hub
    .mapPlayers(it => it
      .setPlayerName(playerId, data.playerName)
      .setPlayerRoomId(playerId, newRoom.id))
    .mapRooms(it => it
      .add(newRoom))
  emitter(Cmd.toOne(playerId, 'joinSuccess', { roomId: newRoom.id }))
  return nextHub
}

/**
 * Event handler for when a player joins a room
 * @type {SocketEventHandler}
 */
const onJoinRoom = (hub, playerId, data, emitter) => {
  console.log(`Player "${data.playerName}" (${playerId}) left the lonely-zone to join room ${data.roomId}.`)
  const nextHub = hub
    .mapPlayers(it => it
      .setPlayerName(playerId, data.playerName)
      .setPlayerRoomId(playerId, data.roomId))
    .mapRoom(data.roomId, it => it
      .addPlayer(playerId))
  emitter(Cmd.toOne(playerId, 'joinSuccess', { roomId: data.roomId }))
  return nextHub
}

/**
 * Event handler for when a player disconnects
 * @type {SocketEventHandler}
 */
const onDisconnect = (hub, playerId) => {
  console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
  return hub.mapPlayers(it => it.remove(playerId))
}

module.exports = new SocketRoute(
  isLonelyPlayer,
  [
    { eventName: 'disconnect', handler: onDisconnect },
    { eventName: 'newRoom', handler: onNewRoom },
    { eventName: 'joinRoom', handler: onJoinRoom }
  ]
)
