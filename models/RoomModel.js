/**
 * @typedef {Object} Room
 * @property {number} _id Uniquely identifies the room
 * @property {string} gameName The name of the currently selected game
 * @property {string[]} playerIds The ids the players in the room
 */

/**
 * Initializes the model for rooms
 * @param mongoose The mongoose instance on this server
 * @returns {Model<Room>} The model
 */
module.exports = (mongoose) => mongoose.model('Room', new mongoose.Schema({
  _id: { type: Number, required: true },
  gameName: { type: String },
  playerIds: { type: [String], required: true }
},
{ collection: 'rooms' }))
