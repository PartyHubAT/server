const Game = require('../models/game.js')
const Library = require('../models/library.js')

/**
 * Loads all games from the filesystem into a library
 * @param {Object} fs File-system
 * @param {Object} gamesPath The path to the games
 * @returns {Promise<Library>} The loaded library
 */
module.exports = async (fs, gamesPath) => {
  console.log('Load games...')

  let library = Library.empty
  const filesInGamesDir = await fs.promises.readdir(gamesPath, { withFileTypes: true })

  filesInGamesDir
    .filter(file => file.isDirectory())
    .map(dir => {
      const info = require(`${gamesPath}/${dir.name}/info.js`)
      const settings = require(`${gamesPath}/${dir.name}/settings.js`)
      const server = require(`${gamesPath}/${dir.name}/server.js`)

      return new Game(info, settings, server)
    })
    .forEach(game => { library = library.add(game) })

  console.log(`Games loaded (${library.gameNames.join(', ')})`)

  return library
}
