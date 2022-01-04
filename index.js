const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

// Load config values

require('dotenv').config()
const port = process.env.PORT || 3000

// Setup globals

const publicPath = path.join(__dirname, 'public')
const app = express()

// Setup routes

app.use('/', express.static(publicPath));

// Start server

(async function startUp () {
  console.log('Server starting...')

  console.log(`Connecting to mongo-db (${process.env.DBCONNECTION})...`)
  await mongoose.connect(process.env.DBCONNECTION)
  console.log('Connected to mongo-db.')
  if (process.env.RESETDBONLAUNCH) {
    await mongoose.connection.db.dropDatabase()
    console.log('Reset db.')
  }
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
