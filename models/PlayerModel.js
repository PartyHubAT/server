/**
 * @typedef {string} PlayerId
 */

/**
 * @typedef {Object} Player
 * @property {String} _id
 * @property {PlayerId} name
 * @property {RoomId|undefined} roomId
 * @property {Boolean} gameLoaded
 */

/**
 * Initializes the model for players
 * @param {module:mongoose} mongoose The mongoose instance on this server
 * @returns {Model<Player>} The model
 */
module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    roomId: { type: Number },
    gameLoaded: { type: Boolean }
  })
  return mongoose.model('Player', schema, 'players')
}
