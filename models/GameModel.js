/**
 * @typedef {Object} Game
 * @property {ObjectId} _id
 * @property {String} name
 */

/**
 * Initializes the model for games
 * @param mongoose The mongoose instance on this server
 * @returns {Model<Game>} The model
 */
module.exports = (mongoose) => mongoose.model('Game', new mongoose.Schema({
  name: { type: String, required: true }
},
{ collection: 'games' }))
