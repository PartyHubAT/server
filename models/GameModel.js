/**
 * @typedef {String} GameName
 */

/**
 * @typedef {Object} Game
 * @property {ObjectId} _id
 * @property {GameName} name
 */

/**
 * Initializes the model for games
 * @param {module:mongoose} mongoose The mongoose instance on this server
 * @returns {Model<Game>} The model
 */
module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
  return mongoose.model('Game', schema, 'games')
}
