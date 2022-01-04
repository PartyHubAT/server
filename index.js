require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
const gameRepo = require('./repos/GamesRepo')(mongoose)
const gameService = require('./services/GamesService')(gameRepo)
const roomRepo = require('./repos/RoomRepo')(mongoose)
const roomService = require('./services/RoomService')(roomRepo)

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

app.get('/games', async (_, res) => {
  res.send({ games: (await gameService.getGameInfo()) })
})

// Setup socket

io.on('connection', socket => {
  async function joinSocketRoom (roomId) {
    const socketRoomId = roomService.getSocketRoomName(roomId)
    const playerNames = await roomService.getPlayerNamesInRoom(roomId)

    socket.join(socketRoomId)
    io.to(socketRoomId).emit('playersChanged', { playerNames })
  }

  socket.on('newRoom', async data => {
    const { playerName } = data
    const roomId = await roomService.openNew(playerName)
    const playerRole = roomService.getPlayerRole(roomId, playerName)

    console.log(`New room created by player "${playerName}". Assigned id ${roomId}.`)

    socket.emit('roomCreated', { roomId })
    socket.emit('roleChanged', { role: playerRole })
    await joinSocketRoom(roomId)
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
