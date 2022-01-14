require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const http = require('http')
const { Server } = require('socket.io')

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

  require('./socket/index.js')(io)

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
