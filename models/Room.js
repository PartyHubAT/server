﻿/**
 * Initializes the model for rooms
 * @param mongoose The mongoose instance on this server
 * @returns {Object} The model
 */
module.exports = (mongoose) => mongoose.model('Room', new mongoose.Schema({
  _id: { type: Number, required: true },
  gameName: { type: String },
  playerIds: { type: [String], required: true }
},
{ collection: 'rooms' }))