/**
 * @typedef {number} RoomId
 */

/**
 * @typedef {Object} Room
 * @property {RoomId} _id Uniquely identifies the room
 * @property {GameName} gameName The name of the currently selected game
 * @property {PlayerId[]} playerIds The ids the players in the room
 * @property {Settings} settings The current settings
 */

const { Schema } = require('mongoose')
/**
 * Initializes the model for rooms
 * @param {module:mongoose} mongoose The mongoose instance on this server
 * @returns {Model<Room>} The model
 */
module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    _id: {
      type: Number,
      required: true
    },
    gameName: { type: String },
    playerIds: {
      type: [String],
      required: true
    },
    settings: {
      type: Schema.Types.Mixed,
      required: true
    }
  })
  return mongoose.model('Room', schema, 'rooms')
}
