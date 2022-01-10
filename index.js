require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
const Hub = require('./models/hub.js')
const playerRepo = require('./repos/PlayerRepo')(mongoose)
const playerService = require('./services/PlayerService')(playerRepo)
const roomRepo = require('./repos/RoomRepo')(mongoose)
const roomService = require('./services/RoomService')(roomRepo, playerService)

;(async function () {
  // Setup globals

  const publicPath = path.join(__dirname, 'public')
  const gamesPath = path.join(__dirname, process.env.GAMESPATH)
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST'],
      credentials: true,
      transports: ['websocket', 'polling']
    },
    allowEIO3: true
  })

  // Load game library

  const library = await (require('./loaders/games.js'))(fs, gamesPath)

  // Setup routes

  // Serves the public folder at root. Used for serving the app
  app.use('/', express.static(publicPath))
  // Serves all games
  app.use('/game/', express.static(gamesPath))

  // Gets info on all games on the server
  app.get('/games', async (_, res) => {
    res.send({ games: library.gameInfo })
  })

  let hub = Hub.empty

  // Setup socket

  function processEmit (emit) {
    if (emit.targetId) io.sockets.sockets.get(emit.targetId).emit(emit.eventNames, emit.data)
    else io.to(emit.roomId).emit(emit.eventNames, emit.data)
  }

  function processSocketEvent (socketId, eventName, data) {
    const { newHub, emits } = hub.processSocketEvent(socketId, eventName, data)
    hub = newHub

    emits.forEach(processEmit)
  }

  io.on('connection', socket => {
    socket.onAny((eventName, ...data) => {
      processSocketEvent(socket.id, eventName, data)
    })

    socket.on('disconnect', () => {
      processSocketEvent(socket.id, 'disconnect', {})
    })

    processSocketEvent(socket.id, 'connect', {})

    /**
     * Send a message to all sockets in the room
     * @param {number} roomId The id of the room to emit to
     * @param {string} event The name of the event
     * @param {Object} data The data to emit
     */
    function emitToRoom (roomId, event, data) {
      const socketRoomName = roomService.getSocketRoomName(roomId)
      io.to(socketRoomName).emit(event, data)
    }

    /**
     * Sends the names of all players in a room to all sockets in that room
     * @param {number} roomId The id of the room to emit to
     * @returns {Promise<void>}
     */
    async function sendNewPlayerNames (roomId) {
      const playerNames = await roomService.getPlayerNamesInRoom(roomId)
      emitToRoom(roomId, 'playersChanged', { playerNames })
    }

    /**
     * Enters the current socket into the socket-room corresponding to the room-id
     * @param {number} roomId The id of the room to join
     * @returns {Promise<void>}
     */
    async function joinSocketRoom (roomId) {
      const socketRoomName = roomService.getSocketRoomName(roomId)
      socket.join(socketRoomName)

      // Whenever a new player joins, send the new player-names to all players in socket
      await sendNewPlayerNames(roomId)
    }

    /**
     * Gets all sockets inside a room
     * @param {number} roomId The id of the room
     * @returns {Socket<any, any, any, any>[]} The sockets
     */
    function getSocketsInRoom (roomId) {
      const socketRoomName = roomService.getSocketRoomName(roomId)

      return Array.from(io.sockets.adapter.rooms.get(socketRoomName))
        .map(socketId => io.sockets.sockets.get(socketId))
    }

    function endGameInRoom (roomId) {
      throw new Error('Ending games is not implemented')
    }

    /**
     * Starts the game
     */
    async function startGame (roomId, gameName) {
      console.log('Initializing game...')

      function emitToAll (event, data) {
        emitToRoom(roomId, event, data)
      }

      function emitToOne (playerId, event, data) {
        io.sockets.sockets.get(playerId).emit(event, data)
      }

      function endGame () {
        endGameInRoom(roomId)
      }

      const players = await roomService.getPlayersInRoom(roomId)
      const game = library.getGameByName(gameName)
      const gameServer = game.serverLogic(emitToAll, emitToOne, endGame, players, game.defaultSettings)

      getSocketsInRoom(roomId).forEach(socket => {
        const events = gameServer.events
        Object.keys(events).forEach(event => {
          socket.on(event, data => {
            events[event](data)
          })
        })
      })

      console.log('Starting game...')

      gameServer.startGame()
    }

    socket.on('newRoom', async data => {
      const { playerName } = data
      const playerId = await playerService.createNew(socket.id, playerName)
      const roomId = await roomService.openNewWithHost(playerId)
      // Is always host probably, so could hard-code, but get it from db just to be safe
      const playerRole = await roomService.getPlayerRole(roomId, playerId)

      console.log(`New room created by player "${playerName}". Assigned id ${roomId}.`)

      socket.emit('roomCreated', { roomId })
      socket.emit('roleChanged', { role: playerRole })
      await joinSocketRoom(roomId)
    })

    socket.on('joinRoom', async data => {
      const {
        playerName,
        roomId
      } = data
      const playerId = await playerService.createNew(socket.id, playerName)
      await roomService.addPlayerToRoom(roomId, playerId)
      const selectedGameName = await roomService.getSelectedGameName(roomId)

      console.log(`Player "${playerName}" joined room ${roomId}.`)

      socket.emit('joinSuccess', { roomId })
      await joinSocketRoom(roomId)
      socket.emit('gameSelected', { gameName: selectedGameName })
    })

    socket.on('selectGame', async data => {
      const playerId = socket.id
      const player = await playerService.getPlayerById(playerId)
      const { gameName } = data
      await roomService.selectGame(player.roomId, gameName)

      console.log(`Player "${player.name}" changed room ${player.roomId}' game to "${gameName}".`)

      emitToRoom(player.roomId, 'gameSelected', { gameName })
    })

    socket.on('startGame', async () => {
      const playerId = socket.id
      const player = await playerService.getPlayerById(playerId)
      const gameName = await roomService.getSelectedGameName(player.roomId)
      await startGame(player.roomId, gameName)

      console.log(`Room ${player.roomId}' started playing "${gameName}".`)

      emitToRoom(player.roomId, 'gameStarted', { gameName })
    })

    socket.on('disconnect', async () => {
      const player = await playerService.getPlayerById(socket.id)
      if (player) {
        if (player.roomId) {
          await roomService.removePlayerFromRoom(player.roomId, player._id)

          await sendNewPlayerNames(player.roomId)
          console.log(`"${player.name}" has disconnected from room ${player.roomId}.`)
        }
        await playerService.remove(player._id)
      }
    })
  })

  // Start server

  console.log('Server starting...')

  // Execute all loaders, to initialize the server

  await (require('./loaders/mongoose'))(mongoose)
  await (require('./loaders/games'))(fs, gamesPath)

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})()
