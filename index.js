require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
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

  // Setup socket

  require('./socketRoutes/index.js')(io)

  io.on('connection', socket => {
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
