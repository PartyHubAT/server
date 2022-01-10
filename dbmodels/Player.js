/**
 * Initializes the model for players
 * @param mongoose The mongoose instance on this server
 * @returns {Object} The model
 */
module.exports = (mongoose) => mongoose.model('Player', new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  roomId: { type: Number }
},
{ collection: 'players' }))
