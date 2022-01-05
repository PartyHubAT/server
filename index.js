require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
const gameRepo = require('./repos/GamesRepo')(mongoose)
const gameService = require('./services/GamesService')(gameRepo)
const playerRepo = require('./repos/PlayerRepo')(mongoose)
const playerService = require('./services/PlayerService')(playerRepo)
const roomRepo = require('./repos/RoomRepo')(mongoose)
const roomService = require('./services/RoomService')(roomRepo, playerService)

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

// Setup routes

app.use('/', express.static(publicPath))
app.use('/game/', express.static(gamesPath))

app.get('/games', async (_, res) => {
  res.send({ games: (await gameService.getGameInfo()) })
})

// Setup socket

io.on('connection', socket => {
  function emitToRoom (roomId, event, data) {
    const socketRoomName = roomService.getSocketRoomName(roomId)
    io.to(socketRoomName).emit(event, data)
  }

  async function sendNewPlayerNames (roomId) {
    const playerNames = await roomService.getPlayerNamesInRoom(roomId)
    emitToRoom(roomId, 'playersChanged', { playerNames })
  }

  async function joinSocketRoom (roomId) {
    const socketRoomName = roomService.getSocketRoomName(roomId)

    socket.join(socketRoomName)
    await sendNewPlayerNames(roomId)
  }

  function getSocketsInRoom (roomId) {
    const socketRoomName = roomService.getSocketRoomName(roomId)

    return Array.from(io.sockets.adapter.rooms.get(socketRoomName))
      .map(socketId => io.sockets.sockets.get(socketId))
  }

  async function registerGameServerLogic (roomId, gameName) {
    const { register } = gameService.getServerLogicFor(gamesPath, gameName)

    // Wait for all sockets to have the server-logic registered
    await Promise.all(
      getSocketsInRoom(roomId)
        .map(async playerSocket => {
          const player = await playerService.getPlayerById(playerSocket.id)
          register(playerSocket, (event, data) => {
            console.log(`"${player.name}" sent a game message in room ${roomId}: ${JSON.stringify(data)}`)
            emitToRoom(roomId, event, data)
          })
        }))
  }

  socket.on('newRoom', async data => {
    const { playerName } = data
    const playerId = await playerService.createNew(socket.id, playerName)
    const roomId = await roomService.openNewWithHost(playerId)
    const playerRole = await roomService.getPlayerRole(roomId, playerId)

    console.log(`New room created by player "${playerName}". Assigned id ${roomId}.`)

    socket.emit('roomCreated', { roomId })
    socket.emit('roleChanged', { role: playerRole })
    await joinSocketRoom(roomId)
  })

  socket.on('joinRoom', async data => {
    const { playerName, roomId } = data
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
    await registerGameServerLogic(player.roomId, gameName)

    console.log(`Room ${player.roomId}' started playing "${gameName}".`)

    emitToRoom(player.roomId, 'gameStarted', { gameName })
  })

  socket.on('disconnect', async () => {
    const player = await playerService.getPlayerById(socket.id)
    if (player) {
      if (player.roomId) {
        await roomService.removePlayer(player.roomId, player._id)

        await sendNewPlayerNames(player.roomId)
        console.log(`"${player.name}" has disconnected from room ${player.roomId}.`)
      }
      await playerService.remove(player._id)
    }
  })
})

// Start server

;(async function startUp () {
  console.log('Server starting...')

  await (require('./loaders/mongoose'))(mongoose)
  await (require('./loaders/games'))(gameService, fs, gamesPath)

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
