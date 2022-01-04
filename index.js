const express = require('express')

// Load config values

require('dotenv').config()
const port = process.env.PORT || 3000

// Setup globals

const app = express();

// Start server

(function startUp () {
  console.log('Server starting...')

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}())
