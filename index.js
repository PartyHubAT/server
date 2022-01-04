require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')
const gameRepo = require('./repos/GamesRepo.js')(mongoose)
const gameService = require('./services/GamesService')(gameRepo, fs)

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

// Start server

;(async function startUp () {
  console.log('Server starting...')

  console.log(`Connecting to mongo-db (${process.env.DBCONNECTION})...`)
  await mongoose.connect(process.env.DBCONNECTION)
  console.log('Connected to mongo-db.')
  if (process.env.RESETDBONLAUNCH) {
    await mongoose.connection.db.dropDatabase()
    console.log('Reset db.')
  }

  console.log('Load games...')
  await gameService.loadFrom(gamesPath)
  console.log(`Games loaded (${(await gameService.getGameNames()).join(', ')})`)

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
