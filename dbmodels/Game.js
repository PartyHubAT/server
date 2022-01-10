/**
 * Initializes the model for games
 * @param mongoose The mongoose instance on this server
 * @returns {Object} The model
 */
module.exports = (mongoose) => mongoose.model('Game', new mongoose.Schema({
  name: { type: String, required: true }
},
{ collection: 'games' }))
