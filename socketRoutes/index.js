const Hub = require('../models/hub.js')
const Emit = require('./emit.js')

/**
 * The routes an event can go down
 * @type {SocketRoute[]}
 */
const routes = [
  require('./unknownRoute.js'),
  require('./lonelyRoute.js'),
  require('./lobbyRoute.js')
]

/**
 * Initialize the socket.io instance
 * @param {Server} io The io instance of this server
 */
function initWebsocket (io) {
  let hub = Hub.empty

  /**
   * Sends an event to a specific socket
   * @param {string} id The sockets id
   * @param {string} eventName The name of the event
   * @param {any} data The data to send
   */
  const sendToSocket = (id, eventName, data) => {
    io.sockets.sockets.get(id).emit(eventName, data)
  }

  /**
   * Sends an event to all sockets in a room
   * @param {number} roomId The id of the room to send to
   * @param {string} eventName The roomId of the event
   * @param {any} data The data to send
   */
  const sendToRoom = (roomId, eventName, data) => {
    io.to(roomId.toString()).emit(eventName, data)
  }

  /**
   * Adds a socket to a room
   * @param {string} id The id of the socket
   * @param {number} roomId The id of the room
   */
  const addSocketToRoom = (id, roomId) => {
    io.sockets.sockets.get(id).join(roomId.toString())
  }

  /**
   * Removes a socket from a room
   * @param {string} id The id of the socket
   * @param {number} roomId The id of the room
   */
  const removeSocketFromRoom = (id, roomId) => {
    io.sockets.sockets.get(id).leave(roomId.toString())
  }

  /**
   * Finds the route a socket-event should go down
   * @param {string} socketId The id of the socket that caused the event
   * @return {SocketRoute|undefined} The root to send this event to or undefined if none is found
   */
  const tryFindRouteForEvent = (socketId) => {
    return routes.find(route => route.pred(hub, socketId))
  }

  /**
   * Finds the path for a given event in the route
   * @param {SocketRoute} route The route
   * @param {string} eventName The name of the event
   * @return {SocketEventHandler} The handler to send the event to
   */
  const findHandlerForEvent = (route, eventName) => {
    const path = route.eventPaths.find(path => path.eventName === eventName)
    return path ? path.handler : route.unknownPathHandler
  }

  /**
   * Handles an emit
   * @param {SocketEmit} emit The emit to handle
   */
  const handleEmit = (emit) => {
    switch (emit.type) {
      case Emit.EMIT_TO_ONE:
        return sendToSocket(emit.playerId, emit.eventName, emit.data)
      case Emit.EMIT_TO_ROOM:
        return sendToRoom(emit.roomId, emit.eventName, emit.data)
      case Emit.JOIN_ROOM:
        return addSocketToRoom(emit.playerId, emit.roomId)
      case Emit.LEAVE_ROOM:
        return removeSocketFromRoom(emit.playerId, emit.roomId)
      default:
        return console.log(`Invalid emit: ${JSON.stringify(emit)}`)
    }
  }

  /**
   * Processes a socket-event
   * @param {string} socketId The id of the socket that caused the event
   * @param {string} eventName The name of the event
   * @param {any} data Any data that was sent with the event
   */
  const processSocketEvent = (socketId, eventName, data) => {
    const route = tryFindRouteForEvent(socketId)

    if (route) {
      const emits = []
      const emit = (e) => emits.push(e)

      const handler = findHandlerForEvent(route, eventName)
      hub = handler(hub, socketId, data, emit)

      emits.forEach(handleEmit)
    } else {
      console.log(`No route was found for event "${eventName}" sent by ${socketId}`)
    }
  }

  io.on('connection', socket => {
    socket.onAny((eventName, data) => {
      processSocketEvent(socket.id, eventName, data)
    })

    socket.on('disconnect', () => {
      processSocketEvent(socket.id, 'disconnect', {})
    })

    processSocketEvent(socket.id, 'connect', {})
  })
}

module.exports = initWebsocket
