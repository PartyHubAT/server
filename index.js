require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
const GameService = require('./services/GameService')
const RoomService = require('./services/RoomService')
const gameRepo = new (require('./repos/GameRepo'))()
const gameService = new (require('./services/GameService'))(gameRepo)
const playerRepo = new (require('./repos/PlayerRepo'))(mongoose)
const playerService = new (require('./services/PlayerService'))(playerRepo)
const roomRepo = new (require('./repos/RoomRepo'))(mongoose)
const roomService = new RoomService(roomRepo, playerService)
const PlayerRole = require('./types/PlayerRole')
const ip = require('./util/ipUtil')

// Setup globals

const publicPath = path.join(__dirname, 'public')
const gamesPath = path.join(__dirname, process.env.GAMESPATH)
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true
})

// Setup routes

// Serves the public folder at root. Used for serving the app
app.use('/', express.static(publicPath))
// Serves all games
app.use('/game/', express.static(gamesPath))

// Gets info on all games on the server
app.get('/games', (_, res) => {
  res.send({ games: (gameService.getAllGames()) })
})

// Gets info on all games on the server
app.get('/gameSettings/:name', async (req, res) => {
  const game = req.params.name
  res.send(await gameService.getSettings(gamesPath, game))
})

// Setup socket

io.on('connection', socket => {
  /**
   * Send a message to all sockets in the room
   * @param {RoomId} roomId The id of the room to emit to
   * @param {string} event The name of the event
   * @param {Object} data The data to emit
   */
  function emitToRoom (roomId, event, data) {
    const socketRoomName = RoomService.getSocketRoomName(roomId)
    io.to(socketRoomName).emit(event, data)
  }

  /**
   * Sends the names of all players in a room to all sockets in that room
   * @param {RoomId} roomId The id of the room to emit to
   * @returns {Promise<void>}
   */
  async function sendNewPlayerNames (roomId) {
    const playerNames = await roomService.tryGetPlayerNamesInRoom(roomId)
    emitToRoom(roomId, 'playersChanged', { playerNames })
  }

  /**
   * Enters the current socket into the socket-room corresponding to the room-id
   * @param {RoomId} roomId The id of the room to join
   * @returns {Promise<void>}
   */
  async function joinSocketRoom (roomId) {
    const socketRoomName = RoomService.getSocketRoomName(roomId)
    socket.join(socketRoomName)

    // Whenever a new player joins, send the new player-names to all players in socket
    await sendNewPlayerNames(roomId)
  }

  /**
   * Gets all sockets inside a room
   * @param {RoomId} roomId The id of the room
   * @returns {Socket<any, any, any, any>[]} The sockets
   */
  function getSocketsInRoom (roomId) {
    const socketRoomName = RoomService.getSocketRoomName(roomId)

    return Array.from(io.sockets.adapter.rooms.get(socketRoomName))
      .map(socketId => io.sockets.sockets.get(socketId))
  }

  function endGameInRoom (roomId) {
    throw new Error('Ending games is not implemented')
  }

  /**
   * Starts the game
   * @param {RoomId} roomId
   * @param {GameName} gameName
   * @param {Settings} settings
   */
  async function startGame (roomId, gameName, settings) {
    console.log('Initializing game...')

    function emitToAll (event, data) {
      emitToRoom(roomId, event, data)
    }

    function emitToOne (playerId, event, data) {
      const playerSocket = io.sockets.sockets.get(playerId)
      if (playerSocket) playerSocket.emit(event, data)
    }

    function endGame () {
      endGameInRoom(roomId)
    }

    const players = await roomService.tryGetPlayersInRoom(roomId)

    const initServerLogic = await GameService.tryGetServerLogicFor(gamesPath, gameName)
    if (!settings) settings = await GameService.tryGetDefaultGameSettings(gamesPath, gameName)
    const gameServer = initServerLogic(emitToAll, emitToOne, endGame, players, settings, mongoose)

    getSocketsInRoom(roomId).forEach(socket => {
      const events = gameServer.events
      Object.keys(events).forEach(event => {
        socket.on(event, data => {
          events[event](socket.id, data)
        })
      })
    })

    console.log('Starting game...')
    gameServer.startGame()
  }

  socket.on('newRoom', async data => {
    const { playerName } = data
    const playerId = socket.id
    await playerService.createNewPlayer(playerId, playerName)
    const roomId = await roomService.tryOpenNewWithHost(playerId)
    // Is always host probably, so could hard-code, but get it from db just to be safe
    const playerRole = await roomService.tryGetPlayerRole(roomId, playerId)

    console.log(`New room created by player "${playerName}". Assigned id ${roomId}.`)

    const gateway = ip.getGatewayIp()
    socket.emit('joinSuccess', { roomId, gateway, port })
    socket.emit('roleChanged', { role: playerRole })
    await joinSocketRoom(roomId)
  })

  socket.on('joinRoom', async data => {
    const { playerName, roomId } = data
    const playerId = socket.id
    const room = await roomService.tryGetRoom(roomId)
    if (!room) {
      socket.emit('InvalidRoom', `No room found with id ${roomId}`)
      return
    }
    await playerService.createNewPlayer(playerId, playerName)
    await roomService.tryAddPlayerToRoom(roomId, playerId)
    const selectedGameName = await roomService.tryGetSelectedGameName(roomId)

    console.log(`Player "${playerName}" joined room ${roomId}.`)

    const gateway = ip.getGatewayIp()
    socket.emit('joinSuccess', { roomId, gateway, port })
    await joinSocketRoom(roomId)
    socket.emit('gameSelected', { gameName: selectedGameName })
  })

  socket.on('selectGame', async data => {
    const playerId = socket.id
    const player = await playerService.tryGetPlayerById(playerId)
    const { gameName } = data

    const playerRole = await roomService.tryGetPlayerRole(player.roomId, player._id)
    if (playerRole !== PlayerRole.HOST) {
      console.error(`Invalid selectGame request from Player "${player.name}" in room ${player.roomId}`)
      return
    }
    await roomService.trySelectGame(player.roomId, gameName)
    console.log(`Player "${player.name}" changed room ${player.roomId}' game to "${gameName}".`)
    emitToRoom(player.roomId, 'gameSelected', { gameName })
  })

  socket.on('gameLoaded', async () => {
    const playerId = socket.id
    const player = await playerService.tryGetPlayerById(playerId)
    await playerService.trySetPlayerGameLoaded(playerId, true)
    console.log(`Game loaded for ${player.name}`)
    const players = await roomService.tryGetPlayersInRoom(player.roomId)
    const gameName = await roomService.tryGetSelectedGameName(player.roomId)
    if (players.every(it => it?.gameLoaded)) {
      const settings = await roomService.tryGetRoomSettings(player.roomId)
      console.log(`Settings loaded: ${JSON.stringify(settings)}`)
      await startGame(player.roomId, gameName, settings)
      console.log(`Room ${player.roomId}' started playing "${gameName}".`)
    }
  })

  socket.on('startGame', async (settings) => {
    const playerId = socket.id
    const player = await playerService.tryGetPlayerById(playerId)
    const gameName = await roomService.tryGetSelectedGameName(player.roomId)
    console.log(`startGame ${settings}`)
    if (settings) {
      console.log(`Settings here ${JSON.stringify(settings)}`)
      await roomService.tryAddSettingsToRoom(player.roomId, JSON.stringify(settings))
    }
    emitToRoom(player.roomId, 'gameStarted', { gameName })
  })

  socket.on('disconnect', async () => {
    const player = await playerService.tryGetPlayerById(socket.id)
    if (player && player.roomId) {
      await roomService.tryRemovePlayerFromRoom(player.roomId, player._id)
      await sendNewPlayerNames(player.roomId)
      await playerService.tryRemove(player._id)
      console.log(`"${player.name}" has disconnected from room ${player.roomId}.`)
    }
  })
})

// Start server

;(async function startUp () {
  console.log('Server starting...')

  // Execute all loaders, to initialize the server

  await (require('./loaders/mongoose'))(mongoose)
  await (require('./loaders/games'))(gameService, fs, gamesPath)

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
