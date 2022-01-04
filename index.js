const express = require('express')
const path = require('path')

// Load config values

require('dotenv').config()
const port = process.env.PORT || 3000

// Setup globals

const publicPath = path.join(__dirname, 'public')
const app = express()

// Setup routes

app.use('/', express.static(publicPath));

// Start server

(function startUp () {
  console.log('Server starting...')

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
